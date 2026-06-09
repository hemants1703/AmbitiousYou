#!/usr/bin/env bash
# One-time VPS provisioning + hardening for the AmbitiousYou backend.
# Target: fresh Ubuntu 24.04 LTS (DigitalOcean 2 GB droplet, or similar). Run as root.
#   ssh root@<VPS_IP> 'bash -s' < infra/setup-vps.sh
#
# After this: create the per-env backend.env files (see README), point DNS at
# this host, issue certs (certbot, see below), then push to dev/main to deploy.
set -euo pipefail

# The OS user GitHub Actions SSHes in as (also owns /opt/ambitiousyou). Defaults
# to your existing sudo user `hemant`; override with `DEPLOY_USER=deploy ...` if
# you'd rather a dedicated least-privilege user. Must equal the VPS_USER secret.
DEPLOY_USER="${DEPLOY_USER:-hemant}"
# The CI deploy PUBLIC key (its private half goes in GitHub secret VPS_SSH_KEY).
# It is APPENDED to the user's authorized_keys, so an existing login key survives.
DEPLOY_PUBKEY="${DEPLOY_PUBKEY:-}"

echo "==> apt update + base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y --no-install-recommends \
  ca-certificates curl gnupg ufw fail2ban unattended-upgrades nginx \
  certbot python3-certbot-nginx

echo "==> swap (2G) if absent"
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> Docker Engine + compose plugin"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> non-root deploy user: $DEPLOY_USER"
id -u "$DEPLOY_USER" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$DEPLOY_USER"
usermod -aG docker "$DEPLOY_USER"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
if [ -n "$DEPLOY_PUBKEY" ]; then
  KEYS="/home/$DEPLOY_USER/.ssh/authorized_keys"
  touch "$KEYS"
  # Append (never overwrite) so an existing user's personal login key survives.
  grep -qxF "$DEPLOY_PUBKEY" "$KEYS" || echo "$DEPLOY_PUBKEY" >> "$KEYS"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$KEYS"
  chmod 600 "$KEYS"
fi

echo "==> narrow sudoers for deploy (nginx reload only, no password)"
cat > /etc/sudoers.d/ambitiousyou-deploy <<EOF
$DEPLOY_USER ALL=(root) NOPASSWD: /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx, /usr/bin/tee /etc/nginx/conf.d/upstream-prod.conf, /usr/bin/tee /etc/nginx/conf.d/upstream-dev.conf
EOF
chmod 440 /etc/sudoers.d/ambitiousyou-deploy

echo "==> firewall: SSH + HTTP + HTTPS only"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> SSH hardening (key-only)"
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh || systemctl restart sshd || true

echo "==> on-host layout under /opt/ambitiousyou"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/ambitiousyou/prod /opt/ambitiousyou/dev
# Seed active_port so the FIRST deploy swaps onto the other (PORTS[0]) port.
# Guarded so re-running this script never resets a live deploy's state.
[ -f /opt/ambitiousyou/prod/active_port ] || echo 3002 > /opt/ambitiousyou/prod/active_port
[ -f /opt/ambitiousyou/dev/active_port ]  || echo 3102 > /opt/ambitiousyou/dev/active_port
chown "$DEPLOY_USER:$DEPLOY_USER" /opt/ambitiousyou/prod/active_port /opt/ambitiousyou/dev/active_port

echo "==> seed initial nginx upstreams (point at the seeded active ports)"
# Guarded so re-running doesn't repoint nginx away from a live container.
[ -f /etc/nginx/conf.d/upstream-prod.conf ] || echo 'upstream backend_prod { server 127.0.0.1:3002; }' > /etc/nginx/conf.d/upstream-prod.conf
[ -f /etc/nginx/conf.d/upstream-dev.conf ]  || echo 'upstream backend_dev  { server 127.0.0.1:3102; }' > /etc/nginx/conf.d/upstream-dev.conf

cat <<'NEXT'

==> Provisioning done. Remaining MANUAL steps:

  1. Copy infra/deploy.sh to /opt/ambitiousyou/deploy.sh (chmod +x, chown hemant).
  2. Copy infra/nginx/sites.conf to /etc/nginx/sites-available/ambitiousyou.conf
     and symlink into sites-enabled; remove the default site.
  3. Create the per-env secret files (mode 600, owned by hemant):
       /opt/ambitiousyou/prod/backend.env
       /opt/ambitiousyou/dev/backend.env
     each with DATABASE_URL (Supabase session-pooler URL), APP_BASE_URL,
     AZURE_CONNECTION_STRING, NODE_ENV=production.
  4. As hemant, authenticate to GHCR so it can pull private images:
       echo <READ_PACKAGES_PAT> | docker login ghcr.io -u <github-user> --password-stdin
     (skip if you make the GHCR package public.)
  5. Point DNS A records api / api.dev at this host, then issue certs:
       certbot --nginx -d api.ambitiousyou.pro -d api.dev.ambitiousyou.pro
  6. Push to dev (then main) — GitHub Actions builds, migrates, and deploys.
NEXT
