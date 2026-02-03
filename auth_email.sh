#!/bin/sh
# Create config directory (just in case)
mkdir -p /home/node/.config/gogcli

# Import credentials properly
echo "Importing credentials..."
gog auth credentials /tmp/client_secret.json

# Run auth command
echo "Starting gog auth..."
gog auth add default --services gmail,calendar,drive,contacts,docs,sheets