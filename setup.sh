#!/usr/bin/env bash

### Check dependencies

command -v node >/dev/null 2>&1 || { echo >&2 "Node is required but it's not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "NPM is required but it's not installed. Aborting."; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo >&2 "Rsync is required but it's not installed. Aborting."; exit 1; }
command -v ssh >/dev/null 2>&1 || { echo >&2 "SSH is required but it's not installed. Aborting."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo >&2 "OpenSSL is required but it's not installed. Aborting."; exit 1; }

### Load and check .env

. .env

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

if [ -z "$WEBSITE_DOMAIN" ]; then
  echo "WEBSITE_DOMAIN is not set. Using default domain: $UBERSPACE_USER.uber.space"
fi

if [ -z "$WEBSITE_MAILBOX" ]; then
  echo "WEBSITE_MAILBOX is not set. Using default mailbox: $UBERSPACE_USER@uber.space"
fi

echo "Setting up project for $UBERSPACE_USER@$UBERSPACE_HOST"

# Helper function to run commands on the uberspace
ssh_u() {
  ssh -i "$UBERSPACE_KEY" "$UBERSPACE_USER@$UBERSPACE_HOST" "$@"
}

### Domain and Mailbox

## Only if WEBSITE_DOMAIN is set
if [ -n "$WEBSITE_DOMAIN" ]; then
  echo "Setting up domain"
  ssh_u "uberspace web domain add $WEBSITE_DOMAIN"
fi

## Only if WEBSITE_MAILBOX is set
if [ -n "$WEBSITE_MAILBOX" ]; then
  echo "Setting up mailbox"
  PASSWORD=$(openssl rand -base64 12)
  echo "Password for $WEBSITE_MAILBOX: $PASSWORD"
  ssh_u "uberspace mail user add $WEBSITE_MAILBOX -p $PASSWORD"

  if [ -n "$WEBSITE_DOMAIN" ]; then
    ssh_u "uberspace mail domain add $WEBSITE_DOMAIN"
  fi
fi

### Database
echo "Setting up database"

rsync -avz -e "ssh -i $UBERSPACE_KEY" init.sql "$UBERSPACE_USER@$UBERSPACE_HOST:/home/$UBERSPACE_USER/init.sql" > /dev/null
ssh_u "mysql --defaults-file=/home/$UBERSPACE_USER/.my.cnf $UBERSPACE_USER < /home/$UBERSPACE_USER/init.sql"
ssh_u "rm /home/$UBERSPACE_USER/init.sql"

### CMS
echo "Building project"

IP_HASH_SALT=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 32)
echo -e "\nIP_HASH_SALT=$IP_HASH_SALT" >> .env


npm run build > /dev/null

echo "Uploading project"
ssh_u "mkdir -p ~/mktcms"
rsync -avz -e "ssh -i $UBERSPACE_KEY" .output/ "$UBERSPACE_USER@$UBERSPACE_HOST:/home/$UBERSPACE_USER/mktcms" > /dev/null

### Service
echo "Setting up service"

SERVICE_FILE_CONTENT="[program:$WEBSITE_DOMAIN]
directory=/home/$UBERSPACE_USER/projects/$WEBSITE_DOMAIN
command=node server/index.mjs
autostart=yes
autorestart=yes
startsecs=10"
ssh_u "echo \"$SERVICE_FILE_CONTENT\" > /home/$UBERSPACE_USER/etc/services.d/$WEBSITE_DOMAIN.ini"

ssh_u "supervisorctl reread"
ssh_u "supervisorctl update"

### Service Backend
echo "Setting up service backend"

ssh_u "uberspace web backend set $WEBSITE_DOMAIN --http --port 3000"

### Done!
echo "Setup completed!"