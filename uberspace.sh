#!/usr/bin/env bash

. .env

### Check .env

if [ -z "$UBERSPACE_USER" ]; then
  echo "UBERSPACE_USER is not set"
  exit 1
fi

if [ -z "$UBERSPACE_HOST" ]; then
  echo "UBERSPACE_HOST is not set"
  exit 1
fi

if [ -z "$UBERSPACE_KEY" ]; then
  echo "UBERSPACE_KEY is not set"
  exit 1
fi

# Helper function to run commands on the Uberspace server
ssh_u() {
  ssh -i "$UBERSPACE_KEY" "$UBERSPACE_USER@$UBERSPACE_HOST" "uberspace $@"
}

# Check if a command was provided
if [ $# -eq 0 ]; then
  echo "Usage: npm run u -- <command>"
  exit 1
fi

# Execute the Uberspace command
ssh_u "$@"