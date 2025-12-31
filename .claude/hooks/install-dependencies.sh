#!/bin/bash

# Exit if not in a web session
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

echo "Starting Claude Code on the web environment setup..."

# Install npm dependencies
if [ -f "package.json" ]; then
  echo "Installing npm dependencies..."
  npm install

  # Persist npm information to environment
  if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo "export PATH=\"\$PATH:$(pwd)/node_modules/.bin\"" >> "$CLAUDE_ENV_FILE"
    echo "export NODE_ENV=development" >> "$CLAUDE_ENV_FILE"
  fi
fi

# Install GitHub CLI if not present
if ! command -v gh &> /dev/null; then
  echo "Installing GitHub CLI..."
  if command -v apt-get &> /dev/null; then
    (type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
      && sudo mkdir -p -m 755 /etc/apt/keyrings \
      && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
      && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
      && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
      && sudo apt update \
      && sudo apt install gh -y
  elif command -v brew &> /dev/null; then
    brew install gh
  else
    echo "Warning: Could not install GitHub CLI. Please install manually."
  fi
fi

# Verify GitHub CLI is available and has repo access
if command -v gh &> /dev/null; then
  echo "GitHub CLI version: $(gh --version | head -n1)"

  # Check if GH_TOKEN is set
  if [ -z "$GH_TOKEN" ] && [ -z "$GITHUB_TOKEN" ]; then
    echo "Warning: GH_TOKEN environment variable is not set."
    echo "Set GH_TOKEN with a personal access token to enable GitHub CLI access."
  else
    # Verify repo access
    if [ -d ".git" ]; then
      REPO_URL=$(git config --get remote.origin.url 2>/dev/null)
      if [ -n "$REPO_URL" ]; then
        echo "Verifying GitHub CLI access to repository..."
        if gh repo view --json name -q '.name' &> /dev/null; then
          REPO_NAME=$(gh repo view --json nameWithOwner -q '.nameWithOwner')
          echo "GitHub CLI authenticated and has access to: $REPO_NAME"
        else
          echo "Error: GitHub CLI cannot access this repository."
          echo "Please ensure your GH_TOKEN has the 'repo' scope."
          exit 1
        fi
      fi
    fi
  fi
fi

echo "Environment setup complete!"
exit 0
