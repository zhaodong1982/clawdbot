FROM node:22-bookworm

# Install Bun (required for build scripts)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

RUN corepack enable

WORKDIR /app

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  curl jq && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Install gog CLI (early to benefit from cache)
RUN curl -L https://github.com/steipete/gogcli/releases/download/v0.9.0/gogcli_0.9.0_linux_arm64.tar.gz -o gogcli.tar.gz && \
  tar -xzf gogcli.tar.gz -C /usr/local/bin gog && \
  chmod +x /usr/local/bin/gog && \
  rm gogcli.tar.gz

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY patches ./patches
# Only copy the specific scripts needed for postinstall to avoid cache bust from other scripts
COPY scripts/postinstall.js scripts/setup-git-hooks.js ./scripts/

# Use cache mount for pnpm storage to avoid re-downloading
# Skip project-level postinstall tasks (git hooks, etc.) during Docker build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  export OPENCLAW_SKIP_POSTINSTALL=1 CLAWDBOT_SKIP_POSTINSTALL=1 && \
  pnpm config set store-dir /pnpm/store && \
  pnpm install --frozen-lockfile

# Now copy the rest of the files
COPY . .

RUN OPENCLAW_A2UI_SKIP_MISSING=1 pnpm build
# Force pnpm for UI build (Bun may fail on ARM/Synology architectures)
ENV OPENCLAW_PREFER_PNPM=1
RUN pnpm ui:build

# Security hardening: Run as non-root user
RUN chown -R node:node /app

# Security hardening: Run as non-root user
# The node:22-bookworm image includes a 'node' user (uid 1000)
# This reduces the attack surface by preventing container escape via root privileges
USER node

# Start gateway server with default config.
# Binds to loopback (127.0.0.1) by default for security.
#
# For container platforms requiring external health checks:
#   1. Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD env var
#   2. Override CMD: ["node","dist/index.js","gateway","--allow-unconfigured","--bind","lan"]
CMD ["node", "dist/index.js", "gateway", "--allow-unconfigured"]
