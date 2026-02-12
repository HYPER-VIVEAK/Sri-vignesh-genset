#!/bin/bash

echo "🌱 Running database seed..."
npm run seed || echo "⚠️  Seed failed, but continuing..."

echo "🚀 Starting development server..."
npm run dev -- --host
