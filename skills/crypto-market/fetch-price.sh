#!/bin/bash
# Fetch real-time BTC and ETH prices from CoinGecko API

set -e

# CoinGecko public API endpoint for simple price
API_URL="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"

response=$(curl -s -H "accept: application/json" "$API_URL")

if [[ -z "$response" || "$response" == "null" ]]; then
  echo "Error: Failed to fetch data from CoinGecko API"
  exit 1
fi

# Print in a very explicit format for AI
echo "--- FRESH_MARKET_DATA_START ---"
echo "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo "$response"
echo "--- FRESH_MARKET_DATA_END ---"
