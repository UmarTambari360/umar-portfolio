# Deploying the portfolio

This guide takes you from a brand-new server to the site running on your own domain with HTTPS. Every step says **what** to do and **why**, so you can fix things yourself when something goes differently.

## 1. What you are deploying

```
                 Internet
                    │  ports 80 / 443
              ┌─────▼──────┐
              │    web     │  Caddy: serves the React files, handles HTTPS,
              │  (Caddy)   │  forwards /api/* to the server
              └─────┬──────┘
        internal Docker network (not reachable from the internet)
              ┌─────▼──────┐     ┌──────────┐     ┌───────┐
              │   server   │────▶│ postgres │     │ redis │
              │ (Express)  │────▶│          │     │       │
              └────────────┘     └──────────┘     └───▲───┘
                    └─────────────────────────────────┘
        migrate: a one-shot job that updates the database tables, then exits
```

Only `web` is reachable from the internet. Postgres, Redis and the API have no published ports, so nobody can connect to them directly, whatever their passwords are.

## 2. Why one server with Docker Compose

The browser calls the API with relative URLs (`/api/...`) and logs in with an `httpOnly` cookie. That design only works when the site and the API share **one origin** (one domain). So the simplest correct deployment serves both from the same place, with a reverse proxy splitting `/api/*` from everything else. That is exactly what Caddy does here.

The alternative, "static host for the frontend + separate host for the API", means two domains, which forces you to add cross-site cookies (`SameSite=None`), strict CORS, and an API base URL setting in the client. It is doable, but it is more moving parts and more ways to break login. Choose it later only if you have a reason (for example, you want a CDN for the frontend).

Caddy was chosen over nginx because it obtains and renews HTTPS certificates **by itself**. With nginx you would also install and schedule certbot.

## 3. Before you start

- **A server (VPS)** running Ubuntu 22.04 or 24.04. 2 GB of RAM is comfortable. With 1 GB, the build can run out of memory: add swap first (see Troubleshooting).
- **A domain name**, with the ability to edit its DNS records.
- **An SSH connection** to the server.
- On your own computer: this repo and `pnpm`, only to generate the password hash.

## 4. Step by step

### Step 1: Point your domain at the server

In your domain provider's DNS settings, create an **A record**: name `@` (or a subdomain such as `portfolio`), value = your server's public IP address. Do this first, because DNS takes minutes to hours to spread, and Caddy needs it to get your certificate.

Check it worked (on your computer): `ping your-domain.com` should show your server's IP.

### Step 2: Prepare the server

```bash
# Log in, then update the system
sudo apt update && sudo apt upgrade -y

# Firewall: allow SSH first (or you lock yourself out!), then web traffic
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw enable

# Install Docker (official convenience script; read it first if you like)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# Log out and back in so the new group applies, then check:
docker --version && docker compose version
```

### Step 3: Get the code onto the server

```bash
git clone <your-repo-url> portfolio
cd portfolio
```

### Step 4: Create the secrets file

```bash
cp deploy/.env.production.example .env.production
nano .env.production
```

Fill in each value. Generate the random ones **on the server**:

```bash
openssl rand -hex 24   # POSTGRES_PASSWORD, REDIS_PASSWORD
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 16   # ANALYTICS_SALT
```

Set `SITE_ADDRESS=your-domain.com` and `PUBLIC_URL=https://your-domain.com`.

**The admin password hash.** On your own computer (not the server), in the repo:

```bash
pnpm hash-password
```

Type your admin password twice (it stays hidden), then paste the printed `ADMIN_PASSWORD_HASH='...'` line into `.env.production`.

> **Keep the single quotes around the hash.** It contains `$` characters, and Docker Compose treats `$name` as a variable. Without quotes, part of your hash silently disappears and login can never work. (The server refuses to start if the hash looks broken, so you would see a clear error rather than a mystery.)

Lock the file down: `chmod 600 .env.production`. It is git-ignored; never commit it.

### Step 5: Start everything

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

The first build takes a few minutes. Docker starts the services in the right order by itself: Postgres and Redis → `migrate` (creates the tables) → `server` → `web`.

Tip: to avoid typing that long command, add `alias dc='docker compose --env-file .env.production -f docker-compose.prod.yml'` to `~/.bashrc`, then use `dc up -d --build`, `dc logs -f`, and so on.

### Step 6: Check that it works

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

All services should be `running` (healthy), and `migrate` should be `exited (0)`. Then open `https://your-domain.com`. The first visit can take a few seconds while Caddy gets the certificate.

Go to `https://your-domain.com/admin`, sign in, and add your projects. (Optional: to load the two sample projects instead, run `docker compose --env-file .env.production -f docker-compose.prod.yml run --rm server node dist/db/seed.js`. It never overwrites existing projects.)

## 5. Updating the site later

```bash
cd portfolio
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Docker rebuilds only what changed. If the update includes a database change, the `migrate` job applies it automatically before the new server starts. Your data lives in a Docker volume, so rebuilding never touches it.

## 6. Backups

Your projects and analytics live only in the `postgres_data` volume. If the server dies, they die with it, so back up regularly:

```bash
./deploy/backup.sh
```

Schedule it daily with cron (`crontab -e`):

```
0 3 * * * cd /home/YOUR_USER/portfolio && ./deploy/backup.sh >> backups/backup.log 2>&1
```

**Copy the `backups/` folder off the server now and then** (for example with `scp`, or `rclone` to cloud storage). A backup on the same disk does not survive losing the server. The restore command is at the top of `deploy/backup.sh`. Practise a restore once, on a spare database, before you need it.

## 7. Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| `docker compose` says a variable is missing | A value in `.env.production` is empty. The message names the variable. |
| Site shows a certificate error or does not load | DNS not pointing at the server yet (`ping` it), or ports 80/443 blocked by a firewall. Look at `docker compose ... logs web`. |
| `server` keeps restarting | Run `docker compose ... logs server`. The server prints exactly which environment variable is invalid. |
| `migrate` fails | `docker compose ... logs migrate`. Usually a wrong `POSTGRES_*` value. If you changed the Postgres password after first start, the old one is stored in the volume: either change it back or reset the database (this deletes data). |
| Login always says "Invalid credentials" | The hash was pasted without single quotes, or you hashed a different password. Re-run `pnpm hash-password`, update `.env.production`, then `docker compose ... up -d` (the server is recreated with the new value). |
| Analytics shows one visitor, always the same | `TRUST_PROXY` is wrong, so the server sees only Caddy's IP. It must be `1` here (the compose file sets it). |
| Build is killed or hangs on a small server | Out of memory. Add swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`. |
| Changes do not show after deploying | Hard-refresh the browser. HTML is never cached, so a normal reload should work too. |

Useful commands (add `--env-file .env.production -f docker-compose.prod.yml` after `docker compose`): `ps` shows status, `logs -f server` follows a service's logs, `restart server` restarts one, `down` stops everything (data stays), `down -v` stops and **deletes all data**.

## 8. Security checklist

- [ ] Only ports 22, 80, 443 open (`sudo ufw status`).
- [ ] `.env.production` is mode 600 and not in git (`git status` should not list it).
- [ ] SSH uses keys, not a password (`PasswordAuthentication no` in `/etc/ssh/sshd_config`).
- [ ] Admin password is long and unique (12+ characters is enforced by the hash script).
- [ ] Backups run, and a copy exists off the server.
- [ ] `sudo apt upgrade` runs from time to time, and `docker compose pull && ... up -d --build` refreshes the base images.

## 9. Known limits

- **Link previews.** Social apps (WhatsApp, X, LinkedIn) read only the static `index.html`, so a shared project link previews as the homepage. Fixing that needs pre-rendering or server-side rendering, a possible later step.
- **One server.** If it goes down, the site is down. That is fine for a portfolio; monitoring (for example a free uptime checker that emails you) is worth adding.

