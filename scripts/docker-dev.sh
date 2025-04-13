#!/bin/bash

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

# Start the Docker containers
docker-compose up -d

# Show logs
docker-compose logs -f
