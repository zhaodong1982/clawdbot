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

# Print as JSON for AI to parse easily
echo "$response"
