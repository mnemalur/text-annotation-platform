#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update the .env file with your configuration values."
fi

# Generate Prisma client
echo "Generating Prisma client..."
pnpm prisma generate

# Create database and run migrations
echo "Setting up database..."
pnpm prisma db push

# Build the project
echo "Building the project..."
pnpm build

echo "Setup complete! You can now start the development server with: pnpm dev" 