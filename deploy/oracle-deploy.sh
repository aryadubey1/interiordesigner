#!/usr/bin/env bash
# Deploy on the Oracle VPS (132.145.172.248).
# GitHub Actions runs this over SSH after every push to main (.github/workflows/deploy.yml).
# Secrets live only in /var/www/lumiere-shared/.env (never in git).
set -euo pipefail
APP=lumiere
PORT=8103
DIR=/var/www/$APP
SHARED=/var/www/$APP-shared
VENV=$SHARED/venv
export DJANGO_SETTINGS_MODULE=config.settings

cd "$DIR"
ln -sfn "$SHARED/.env" .env

[ -x "$VENV/bin/python" ] || python3 -m venv "$VENV"
"$VENV/bin/pip" install -q --upgrade pip
"$VENV/bin/pip" install -q -r requirements.txt
"$VENV/bin/python" manage.py migrate --noinput
"$VENV/bin/python" manage.py collectstatic --noinput -v 0

sudo install -m 644 "deploy/$APP.service" "/etc/systemd/system/$APP.service"
sudo systemctl daemon-reload
sudo systemctl enable -q "$APP"
sudo systemctl restart "$APP"

# Health check: the app must answer within ~30s
for i in $(seq 1 15); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $APP.clarifyweb.com" -H 'X-Forwarded-Proto: https' "http://127.0.0.1:$PORT/" || true)
  case "$code" in 200|301|302) echo "✅ $APP is up (HTTP $code)"; exit 0;; esac
  sleep 2
done
echo "❌ $APP did not come up (last HTTP $code)"; sudo journalctl -u "$APP" -n 40 --no-pager; exit 1
