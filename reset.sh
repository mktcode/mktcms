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

# Ask user for confirmation
read -p "Are you sure you want to reset the Uberspace? [y/N]" -n 1 -r
# Move to new line
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# Helper function to run commands on the uberspace
ssh_u() {
  ssh -i "$UBERSPACE_KEY" "$UBERSPACE_USER@$UBERSPACE_HOST" "$@"
}

### Domain and Mailbox

if [ -n "$WEBSITE_DOMAIN" ]; then
  echo "Removing domain"
  ssh_u "uberspace web domain del $WEBSITE_DOMAIN"
  ssh_u "uberspace mail domain del $WEBSITE_DOMAIN"
fi

if [ -n "$WEBSITE_MAILBOX" ]; then
  echo "Removing mailbox"
  ssh_u "uberspace mail user del $WEBSITE_MAILBOX"
fi

### Database
echo "Removing database"

ssh_u "mysql --defaults-file=/home/$UBERSPACE_USER/.my.cnf $UBERSPACE_USER -e 'DROP DATABASE IF EXISTS $UBERSPACE_USER'"
ssh_u "mysql --defaults-file=/home/$UBERSPACE_USER/.my.cnf -e 'CREATE DATABASE IF NOT EXISTS $UBERSPACE_USER'"

### CMS
echo "Removing project"

ssh_u "rm -rf /home/$UBERSPACE_USER/mktcms"

### Service
echo "Removing service"

ssh_u "supervisorctl stop $WEBSITE_DOMAIN"
ssh_u "rm /home/$UBERSPACE_USER/etc/services.d/$WEBSITE_DOMAIN.ini"
ssh_u "supervisorctl reread"
ssh_u "supervisorctl update"

### Service Backend
echo "Removing service backend"

ssh_u "uberspace web backend del $WEBSITE_DOMAIN"

### Done!
echo "Reset completed!"