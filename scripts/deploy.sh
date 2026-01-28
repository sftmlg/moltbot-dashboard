#!/bin/bash
# MoltBot Dashboard - Vercel Deployment Script
# 
# Usage: ./scripts/deploy.sh [--prod]
#
# Target URL: moltbot-dashboard.vercel.app

set -e

cd "$(dirname "$0")/.."

echo "🚀 MoltBot Dashboard - Vercel Deployment"
echo "========================================="
echo "Target: moltbot-dashboard.vercel.app"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Not logged in. Starting authentication..."
    vercel login
fi

# Determine if production deploy
PROD_FLAG=""
if [ "$1" = "--prod" ]; then
    PROD_FLAG="--prod"
    echo "📦 Production deployment selected"
fi

echo ""
echo "🔗 Linking project..."

# Link project (creates .vercel folder)
if [ ! -d ".vercel" ]; then
    vercel link --yes
fi

echo ""
echo "🏗️  Building and deploying..."

# Deploy
if [ -n "$PROD_FLAG" ]; then
    vercel --prod
else
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 URL: https://moltbot-dashboard.vercel.app"
