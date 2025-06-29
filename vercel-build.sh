#!/bin/bash
# Vercel build script for Prisma projects

echo "🔧 Starting Vercel build with Prisma generation..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Build Next.js app
echo "🚀 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
