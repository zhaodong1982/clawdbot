---
name: crypto-market
description: Fetch real-time cryptocurrency market prices (BTC, ETH) using official APIs.
metadata:
  {
    "openclaw":
      {
        "emoji": "📈",
        "requires": { "bins": ["curl"] }
      },
  }
---

# crypto-market

Use this skill to get accurate, real-time prices for BTC and ETH. This bypasses web search artifacts and provides structured data directly from CoinGecko.

## Usage

Run the fetch script:
- `bash skills/crypto-market/fetch-price.sh`

## Output Format (JSON)
```json
{
  "bitcoin": {
    "usd": 78469.11,
    "usd_24h_change": 1.25
  },
  "ethereum": {
    "usd": 2330.19,
    "usd_24h_change": -0.5
  }
}
```

## Guidelines
- **Always prefer this tool** over `web_search` for BTC/ETH price checks.
- Data is in USD.
- `usd_24h_change` is a percentage.
