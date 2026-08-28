#!/usr/bin/env bash
# (paste the same script body from the file above starting with the shebang)
#!/usr/bin/env bash
# Minimal automated setup for: move current project to frontend/, create Laravel backend, add MySQL docker-compose
# Run from project root on macOS. Requirements: docker, docker-compose (Docker Desktop), composer, node/npm.
set -euo pipefail

ROOT="$(pwd)"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_DIR="$ROOT/backend/laravel"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ">>> BACK UP your repo now if you haven't. Script will move files."
read -p "Proceed? (y/N) " yn
if [[ "${yn:-N}" != "y" && "${yn:-N}" != "Y" ]]; then
  echo "Aborting."
  exit 1
fi

# command -v docker >/dev/null 2>&1 || { echo "docker not found. Install Docker Desktop for Mac and retry."; exit 1; }
# command -v composer >/dev/null 2>&1 || { echo "composer not found. Install via 'brew install composer' or getcomposer.org"; exit 1; }
# command -v npm >/dev/null 2>&1 || { echo "npm not found. Install Node.js (brew install node)"; exit 1; }

# 1) Move current project content into frontend/ unless it already exists.
if [ -d "$FRONTEND_DIR" ]; then
  echo "frontend/ exists — skipping move."
else
  mkdir -p "$FRONTEND_DIR"
  echo "Moving repo files into frontend/ (skipping backend/, scripts/, .git)"
  shopt -s dotglob
  for entry in "$ROOT"/* "$ROOT"/.[!.]*; do
    [ -e "$entry" ] || continue
    name="$(basename "$entry")"
    if [[ "$name" == "backend" || "$name" == "scripts" || "$name" == ".git" || "$name" == "docker-compose.yml" ]]; then
      continue
    fi
    mv "$entry" "$FRONTEND_DIR/" || true
  done
  shopt -u dotglob
  echo "Moved files into frontend/."
fi

# 2) Create Laravel project if not present
if [ -d "$BACKEND_DIR" ]; then
  echo "Laravel backend already exists at $BACKEND_DIR — skipping create-project."
else
  mkdir -p "$(dirname "$BACKEND_DIR")"
  echo "Creating Laravel project in $BACKEND_DIR (this may take a few minutes)..."
  composer create-project --prefer-dist laravel/laravel "$BACKEND_DIR"
fi

# 3) Write docker-compose.yml to root
cat > docker-compose.yml <<'YAML'
version: "3.8"
services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: secret_root_password
      MYSQL_DATABASE: biashara
      MYSQL_USER: biashara_user
      MYSQL_PASSWORD: biashara_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  php:
    image: php:8.1-cli
    working_dir: /var/www
    volumes:
      - ./backend/laravel:/var/www
    depends_on:
      - db
    command: ["sleep", "infinity"] # helper container; use host or artisan via composer in container if needed

  node:
    image: node:18
    working_dir: /workdir
    volumes:
      - ./frontend:/workdir
    ports:
      - "3000:3000"
    command: ["sh", "-c", "npm install --no-audit --no-fund && npm run dev"]
volumes:
  db_data:
YAML

echo "Wrote docker-compose.yml"

# 4) Configure Laravel .env DB settings
if [ -f "$BACKEND_DIR/.env" ]; then
  cp "$BACKEND_DIR/.env" "$BACKEND_DIR/.env.bak" || true
else
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

# Replace or add DB_* values
set +e
perl -0777 -pe 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/s' -i "$BACKEND_DIR/.env"
perl -0777 -pe 's/DB_HOST=.*/DB_HOST=db/s' -i "$BACKEND_DIR/.env"
perl -0777 -pe 's/DB_PORT=.*/DB_PORT=3306/s' -i "$BACKEND_DIR/.env"
perl -0777 -pe 's/DB_DATABASE=.*/DB_DATABASE=biashara/s' -i "$BACKEND_DIR/.env"
perl -0777 -pe 's/DB_USERNAME=.*/DB_USERNAME=biashara_user/s' -i "$BACKEND_DIR/.env"
perl -0777 -pe 's/DB_PASSWORD=.*/DB_PASSWORD=biashara_pass/s' -i "$BACKEND_DIR/.env"
set -e

echo "Configured $BACKEND_DIR/.env DB settings (backup at .env.bak if existed)."

# 5) Start Docker services
echo "Starting docker services (db + node + php container)..."
docker-compose up -d

# 6) Finalize Laravel: composer install, key, migrate
echo "Running composer install and artisan key:generate in backend..."
cd "$BACKEND_DIR"
composer install --no-interaction || true
php artisan key:generate || true

# Wait for MySQL to accept connections
echo "Waiting for MySQL to be ready (up to 60s)..."
i=0
until docker exec $(docker ps -q -f ancestor=mysql:8.0 | head -n1) sh -c 'mysqladmin ping -h "127.0.0.1" -uroot -psecret_root_password' >/dev/null 2>&1 || [ $i -ge 60 ]; do
  sleep 1
  i=$((i+1))
done

echo "Attempting migrations (may fail if DB not ready)."
php artisan migrate --force || echo "Migrate failed; run 'php artisan migrate' later."

# 7) Install frontend deps locally (not in container) so developer can run directly
echo "Installing frontend dependencies in frontend/ (local npm install)..."
cd "$ROOT/frontend"
npm install || echo "npm install failed in frontend — run 'npm install' manually."

echo "=== Done ===
Frontend: $FRONTEND_DIR (run: cd frontend && npm run dev)
Backend (Laravel): $BACKEND_DIR (run: cd backend/laravel && php artisan serve --host=0.0.0.0 --port=8000 or use php container)
MySQL: docker-compose up -d (already started)

Inspect docker-compose.yml, backend/.env, and scripts/setup-laravel.sh before running.
"
exit 0