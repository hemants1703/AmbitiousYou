#!/usr/bin/env bash
# Zero-downtime blue-green deploy for one backend environment.
# Lives on the VPS at /opt/ambitiousyou/deploy.sh and is invoked by GitHub
# Actions over SSH:   bash /opt/ambitiousyou/deploy.sh <prod|dev> <image:tag>
#
# Mechanism: start the new image on the IDLE port, health-gate it, rewrite the
# nginx upstream to point at it, graceful `reload`, then remove the old one.
# nginx finishes in-flight requests on the old worker -> users never see a 502.
set -euo pipefail

ENV="${1:?usage: deploy.sh <prod|dev> <image:tag>}"
IMAGE="${2:?usage: deploy.sh <prod|dev> <image:tag>}"

case "$ENV" in
  prod) PORTS=(3001 3002) ;;
  dev)  PORTS=(3101 3102) ;;
  *) echo "unknown env: $ENV (expected prod|dev)" >&2; exit 1 ;;
esac

DIR="/opt/ambitiousyou/$ENV"
STATE="$DIR/active_port"
ENV_FILE="$DIR/backend.env"

[ -f "$ENV_FILE" ] || { echo "missing env file: $ENV_FILE" >&2; exit 1; }

# Determine current active vs idle port (default so first deploy lands on PORTS[0]).
CUR="$(cat "$STATE" 2>/dev/null || echo "${PORTS[1]}")"
if [ "$CUR" = "${PORTS[0]}" ]; then IDLE="${PORTS[1]}"; else IDLE="${PORTS[0]}"; fi
NEW="ay-backend-$ENV-$IDLE"
OLD="ay-backend-$ENV-$CUR"

echo "==> $ENV: deploying $IMAGE onto idle port $IDLE (current active: $CUR)"

docker pull "$IMAGE"
docker rm -f "$NEW" 2>/dev/null || true

# Container always listens on 3001 internally; publish to the idle host port,
# bound to localhost only (nginx is the sole public entrypoint).
docker run -d --name "$NEW" --restart unless-stopped \
  --env-file "$ENV_FILE" \
  -p "127.0.0.1:$IDLE:3001" \
  "$IMAGE"

# Health gate: up to ~60s for the new container to report DB-ready.
echo "==> waiting for $NEW to become healthy on :$IDLE"
OK=0
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:$IDLE/health" >/dev/null 2>&1; then OK=1; break; fi
  sleep 2
done
if [ "$OK" != 1 ]; then
  echo "!! health check FAILED — aborting, leaving $OLD live" >&2
  docker logs --tail 80 "$NEW" || true
  docker rm -f "$NEW" || true
  exit 1
fi

# Flip nginx upstream -> graceful reload (zero downtime).
echo "upstream backend_$ENV { server 127.0.0.1:$IDLE; }" \
  | sudo tee "/etc/nginx/conf.d/upstream-$ENV.conf" >/dev/null
sudo nginx -t
sudo systemctl reload nginx

echo "$IDLE" > "$STATE"

# Drain + remove the old container (stop_grace honors SIGTERM pool drain).
if [ "$OLD" != "$NEW" ]; then
  docker stop -t 30 "$OLD" 2>/dev/null || true
  docker rm -f "$OLD" 2>/dev/null || true
fi

docker image prune -f >/dev/null 2>&1 || true
echo "==> ✓ $ENV is now serving on port $IDLE ($IMAGE)"
