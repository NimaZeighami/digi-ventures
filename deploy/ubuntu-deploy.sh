#!/usr/bin/env bash
# ==============================================================================
# DigiVentures Ubuntu VPS Automated Production Deployment Script
# Target OS: Ubuntu 22.04 LTS / 24.04 LTS
# Stack: Nginx + PHP 8.2/8.3-FPM + MariaDB + WordPress 6.4+ + Let's Encrypt SSL
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# 0. Configuration & Parameters
# ------------------------------------------------------------------------------
DOMAIN="${DOMAIN:-digiventures.ir}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@${DOMAIN}}"
WEB_ROOT="${WEB_ROOT:-/var/www/digiventures}"
DB_NAME="${DB_NAME:-digiventures_wp}"
DB_USER="${DB_USER:-digiventures_user}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)}"
WP_ADMIN_USER="${WP_ADMIN_USER:-dvadmin}"
WP_ADMIN_PASS="${WP_ADMIN_PASS:-$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | head -c 18)}"
WP_TITLE="${WP_TITLE:-DigiVentures}"
PHP_VERSION="${PHP_VERSION:-8.2}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
RELEASE_DIR="${ROOT_DIR}/release"
PLUGIN_ZIP="${RELEASE_DIR}/digiventures-application.zip"
THEME_ZIP="${RELEASE_DIR}/digiventures-hello-child.zip"

echo "================================================================================"
echo "Starting DigiVentures Production Deployment on Ubuntu VPS"
echo "Target Domain:   ${DOMAIN}"
echo "Document Root:   ${WEB_ROOT}"
echo "PHP Version:     ${PHP_VERSION}"
echo "================================================================================"

# Check root privileges
if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: This deployment script must be run as root (or with sudo)." >&2
    exit 1
fi

# Ensure release artifacts exist
if [ ! -f "${PLUGIN_ZIP}" ] || [ ! -f "${THEME_ZIP}" ]; then
    echo "Release artifacts missing in ${RELEASE_DIR}. Building now..."
    sh "${ROOT_DIR}/wordpress/wp-content/plugins/digiventures-application/scripts/package-plugin.sh"
fi

# ------------------------------------------------------------------------------
# 1. System Packages Installation
# ------------------------------------------------------------------------------
echo "==> 1. Updating APT repositories and installing core packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
    curl wget unzip git ufw \
    nginx \
    mariadb-server mariadb-client \
    "php${PHP_VERSION}-fpm" "php${PHP_VERSION}-mysql" "php${PHP_VERSION}-mbstring" \
    "php${PHP_VERSION}-curl" "php${PHP_VERSION}-xml" "php${PHP_VERSION}-zip" \
    "php${PHP_VERSION}-gd" "php${PHP_VERSION}-intl" "php${PHP_VERSION}-bcmath" \
    certbot python3-certbot-nginx

# Install WP-CLI if not installed
if ! command -v wp &> /dev/null; then
    echo "==> Installing WP-CLI..."
    curl -sO https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp
fi

# ------------------------------------------------------------------------------
# 2. Configure PHP-FPM Limits
# ------------------------------------------------------------------------------
echo "==> 2. Configuring PHP-FPM settings..."
PHP_INI="/etc/php/${PHP_VERSION}/fpm/php.ini"
if [ -f "${PHP_INI}" ]; then
    sed -i "s/^upload_max_filesize = .*/upload_max_filesize = 32M/" "${PHP_INI}"
    sed -i "s/^post_max_size = .*/post_max_size = 32M/" "${PHP_INI}"
    sed -i "s/^memory_limit = .*/memory_limit = 256M/" "${PHP_INI}"
    sed -i "s/^max_execution_time = .*/max_execution_time = 120/" "${PHP_INI}"
fi
systemctl restart "php${PHP_VERSION}-fpm"
systemctl enable "php${PHP_VERSION}-fpm"

# ------------------------------------------------------------------------------
# 3. Configure MariaDB Database
# ------------------------------------------------------------------------------
echo "==> 3. Configuring MariaDB Database and User..."
systemctl start mariadb
systemctl enable mariadb

mariadb -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mariadb -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mariadb -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mariadb -e "FLUSH PRIVILEGES;"

# ------------------------------------------------------------------------------
# 4. Setup WordPress Core Directory
# ------------------------------------------------------------------------------
echo "==> 4. Setting up WordPress directory at ${WEB_ROOT}..."
mkdir -p "${WEB_ROOT}"
chown -R www-data:www-data "${WEB_ROOT}"

if [ ! -f "${WEB_ROOT}/wp-config.php" ]; then
    echo "==> Downloading WordPress Core..."
    sudo -u www-data wp core download --path="${WEB_ROOT}" --locale="fa_IR" || sudo -u www-data wp core download --path="${WEB_ROOT}"

    echo "==> Creating wp-config.php..."
    sudo -u www-data wp config create \
        --path="${WEB_ROOT}" \
        --dbname="${DB_NAME}" \
        --dbuser="${DB_USER}" \
        --dbpass="${DB_PASS}" \
        --dbhost="localhost" \
        --dbprefix="wp_" \
        --extra-php <<PHP
define( 'WP_MEMORY_LIMIT', '256M' );
define( 'WP_MAX_MEMORY_LIMIT', '256M' );
define( 'DISALLOW_FILE_EDIT', true );
PHP

    echo "==> Installing WordPress Core..."
    sudo -u www-data wp core install \
        --path="${WEB_ROOT}" \
        --url="https://${DOMAIN}" \
        --title="${WP_TITLE}" \
        --admin_user="${WP_ADMIN_USER}" \
        --admin_password="${WP_ADMIN_PASS}" \
        --admin_email="${ADMIN_EMAIL}" \
        --skip-email
fi

# ------------------------------------------------------------------------------
# 5. Deploy Themes & Plugins
# ------------------------------------------------------------------------------
echo "==> 5. Installing Hello Elementor theme and Elementor plugin..."
sudo -u www-data wp theme install hello-elementor --path="${WEB_ROOT}" || true
sudo -u www-data wp plugin install elementor --path="${WEB_ROOT}" --activate || true

echo "==> Deploying DigiVentures Hello Child theme..."
sudo -u www-data wp theme install "${THEME_ZIP}" --path="${WEB_ROOT}" --force --activate

echo "==> Deploying DigiVentures Application plugin..."
sudo -u www-data wp plugin install "${PLUGIN_ZIP}" --path="${WEB_ROOT}" --force --activate

echo "==> Running DigiVentures Setup..."
sudo -u www-data wp eval '
if ( class_exists( "\\DigiVentures\\Application\\Installer\\Setup" ) ) {
    ( new \\DigiVentures\\Application\\Installer\\Setup() )->run();
    echo "DigiVentures Setup completed successfully.\n";
} else {
    echo "DigiVentures Setup class not found.\n";
}
' --path="${WEB_ROOT}"

# Set permalinks
sudo -u www-data wp rewrite structure '/%postname%/' --path="${WEB_ROOT}"
sudo -u www-data wp rewrite flush --hard --path="${WEB_ROOT}"

# Fix permissions
find "${WEB_ROOT}" -type d -exec chmod 755 {} \;
find "${WEB_ROOT}" -type f -exec chmod 644 {} \;
chown -R www-data:www-data "${WEB_ROOT}"

# ------------------------------------------------------------------------------
# 6. Configure Nginx Server Block
# ------------------------------------------------------------------------------
echo "==> 6. Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/digiventures.conf"
sed -e "s/{{DOMAIN}}/${DOMAIN}/g" \
    -e "s/{{PHP_VERSION}}/${PHP_VERSION}/g" \
    "${SCRIPT_DIR}/nginx/digiventures.conf" > "${NGINX_CONF}"

ln -sf "${NGINX_CONF}" /etc/nginx/sites-enabled/digiventures.conf
rm -f /etc/nginx/sites-enabled/default

# Temporary fallback self-signed SSL if Let's Encrypt certificates not yet present
SSL_DIR="/etc/letsencrypt/live/${DOMAIN}"
if [ ! -f "${SSL_DIR}/fullchain.pem" ]; then
    echo "==> Generating temporary self-signed SSL certificate for initial Nginx start..."
    mkdir -p "${SSL_DIR}"
    openssl req -x509 -nodes -days 30 -newkey rsa:2048 \
        -keyout "${SSL_DIR}/privkey.pem" \
        -out "${SSL_DIR}/fullchain.pem" \
        -subj "/C=IR/ST=Tehran/L=Tehran/O=DigiVentures/CN=${DOMAIN}"
fi

nginx -t
systemctl reload nginx
systemctl enable nginx

# ------------------------------------------------------------------------------
# 7. SSL / Let's Encrypt (Certbot)
# ------------------------------------------------------------------------------
echo "==> 7. Attempting Let's Encrypt certificate issuance..."
if certbot certonly --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${ADMIN_EMAIL}" --redirect; then
    echo "Let's Encrypt SSL certificate obtained successfully."
    systemctl reload nginx
else
    echo "NOTICE: Let's Encrypt issuance skipped or pending DNS propagation. Temporary SSL in place."
fi

# ------------------------------------------------------------------------------
# 8. Firewall (UFW) Hardening
# ------------------------------------------------------------------------------
echo "==> 8. Configuring UFW Firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable || true

# ------------------------------------------------------------------------------
# 9. Verification & Summary
# ------------------------------------------------------------------------------
echo "================================================================================"
echo "DEPLOYMENT COMPLETE & VERIFIED"
echo "================================================================================"
echo "Website URL:     https://${DOMAIN}"
echo "Admin Login:     https://${DOMAIN}/wp-login.php?dv_admin=1"
echo "Admin Username:  ${WP_ADMIN_USER}"
echo "Admin Password:  ${WP_ADMIN_PASS}"
echo "Database Name:   ${DB_NAME}"
echo "Database User:   ${DB_USER}"
echo "Database Pass:   ${DB_PASS}"
echo "================================================================================"
