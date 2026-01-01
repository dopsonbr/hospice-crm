#!/bin/bash
# Run e2e tests using Docker

set -e

echo "Building and running e2e tests in Docker..."

# Build images
docker compose build

# Run e2e tests
docker compose up --abort-on-container-exit --exit-code-from e2e

# Cleanup
docker compose down

echo "E2E tests completed. Check playwright-report/ for results."
