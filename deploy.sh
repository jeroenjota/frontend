#!/bin/bash

# === Config ===
SERVER_USER=jeroen
SERVER_HOST=piweb
REMOTE_TEMP_DIR=/home/$SERVER_USER/jota-tours-temp
REMOTE_TARGET_DIR=/var/www/jota-tours/frontend

# === Stap 1: Build project ===
echo "🔧 Bouwen van project..."
npm run build

# === Stap 2: Upload naar tijdelijke map ===
echo "🚀 Uploaden naar $SERVER_HOST:$REMOTE_TEMP_DIR..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_TEMP_DIR"
scp -r dist/* $SERVER_USER@$SERVER_HOST:$REMOTE_TEMP_DIR/

# === Stap 3: Verplaats op server met sudo ===
echo "📦 Verplaatsen naar $REMOTE_TARGET_DIR..."
ssh $SERVER_USER@$SERVER_HOST "sudo rm -rf $REMOTE_TARGET_DIR/* && sudo mv $REMOTE_TEMP_DIR/* $REMOTE_TARGET_DIR/ && rm -rf $REMOTE_TEMP_DIR"

echo "✅ Deploy afgerond!"
