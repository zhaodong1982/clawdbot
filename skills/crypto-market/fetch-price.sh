#!/bin/bash
# Fetch real-time BTC and ETH prices and compare with last reported prices

set -e

# Configuration
WORKSPACE_DIR="/Users/d/.openclaw/workspace" # Defaut for remote/mac
# If running in Docker, workspace is at /home/node/.openclaw/workspace
if [ -d "/home/node/.openclaw/workspace" ]; then
  WORKSPACE_DIR="/home/node/.openclaw/workspace"
fi

STATE_FILE="$WORKSPACE_DIR/memory/price-state.json"
THRESHOLD=0.05 # 5%

# Ensure state file exists
if [ ! -f "$STATE_FILE" ]; then
  mkdir -p "$(dirname "$STATE_FILE")"
  echo '{"BTC": 0, "ETH": 0, "lastReportedBTC": 0, "lastReportedETH": 0}' > "$STATE_FILE"
fi

# CoinGecko public API
API_URL="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
response=$(curl -s -H "accept: application/json" "$API_URL")

if [[ -z "$response" || "$response" == "null" ]]; then
  echo "Error: Failed to fetch data from CoinGecko API"
  exit 1
fi

# Parse current prices
current_btc=$(echo "$response" | jq -r '.bitcoin.usd')
current_eth=$(echo "$response" | jq -r '.ethereum.usd')

# Read last reported prices
last_btc=$(jq -r '.lastReportedBTC // .BTC' "$STATE_FILE")
last_eth=$(jq -r '.lastReportedETH // .ETH' "$STATE_FILE")

# Calculate changes (using awk for float math)
check_alert=$(awk "BEGIN {
  btc_change = ($current_btc - $last_btc) / ($last_btc > 0 ? $last_btc : $current_btc);
  btc_abs = (btc_change < 0 ? -btc_change : btc_change);
  eth_change = ($current_eth - $last_eth) / ($last_eth > 0 ? $last_eth : $current_eth);
  eth_abs = (eth_change < 0 ? -eth_change : eth_change);
  if (btc_abs >= $THRESHOLD || eth_abs >= $THRESHOLD || $last_btc == 0) { print 1 } else { print 0 }
}")

echo "--- FRESH_MARKET_DATA_START ---"
echo "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo "Current Prices: BTC: \$$current_btc, ETH: \$$current_eth"

if [ "$check_alert" -eq 1 ]; then
  echo "Status: [ALERT] Significant price fluctuation detected (>= 5%)."
  echo "Instruction: Please generate a market report for the user."
  # Update state only when we alert/report
  jq --arg btc "$current_btc" --arg eth "$current_eth" \
     '.lastReportedBTC = ($btc|tonumber) | .lastReportedETH = ($eth|tonumber) | .BTC = ($btc|tonumber) | .ETH = ($eth|tonumber)' \
     "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
else
  echo "Status: [SUCCESS] Price fluctuation is minimal (< 5%)."
  echo "Instruction: DO NOT report to chat. Simply reply with 'HEARTBEAT_OK'."
  # Update current prices in state silently
  jq --arg btc "$current_btc" --arg eth "$current_eth" \
     '.BTC = ($btc|tonumber) | .ETH = ($eth|tonumber)' \
     "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
fi

echo "--- FRESH_MARKET_DATA_END ---"
