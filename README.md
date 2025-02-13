# Mkt's CMS

A simple content management system for [Uberspace](https://uberspace.de).

- You can't host multiple websites with this CMS. See [Mkt's CMS Admin](https://github.com/mktcode/mktcms-admin).
- It's a Nuxt/Vue application you can take full control of in terms of design and functionality. Tailwind and other useful things included.
- It uses a MySQL database in production and SQLite in development.

## Setup

Create a new Uberspace and add an SSH key. Then:

```bash
git clone https://github.com/mktcode/mktcms.git
cd mktcms
cp .env.example .env
```

```bash
# .env
UBERSPACE_USER=user
UBERSPACE_HOST=norma.uberspace.de
UBERSPACE_KEY=~/.ssh/ssh-key

# Optional
WEBSITE_DOMAIN=example.com # Default: user.uber.space
WEBSITE_EMAIL=info@example.com # Default: user@uber.space
```

```bash
npm run setup
```

This will now prepare the Uberspace (domain, email, service, backend, database), deploy the CMS and create dashboard accounts for an admin and a user.

Now you can:

```bash
# Update production deployment
npm run deploy

# Control production service
npm run start
npm run restart
npm run stop

# Run an Uberspace command
npm run u -- web domain add example.com

# Run the development server and build
npm run dev
```

When you stop the service, a maintenance page will be displayed.