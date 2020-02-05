# PolkaStats setup

Instructions to install PolkaStats platform (frontend, backend and all dependencies) in Ubuntu 18.04.

NOTE: Run following commands as root user.

## Upgrade

```
apt update
apt -y upgrade
reboot
```

## Install Rust

```
curl https://sh.rustup.rs -sSf | sh
. ~/.profile
rustup update
```

## Install Polkadot

```
apt -y install make clang pkg-config libssl-dev build-essential
cd /usr/local
git clone https://github.com/paritytech/polkadot.git
cd polkadot
git checkout v0.7.20
./scripts/init.sh 
cargo build --release
```

## Polkadot node systemd service

```
nano /etc/systemd/system/polkadot.service
```

```
[Unit]
Description=Kusama full node

[Service]
ExecStart=/usr/local/polkadot/target/release/polkadot --chain=kusama --pruning=archive --name '🤖 PolkaStats'
Restart=always

[Install]
WantedBy=multi-user.target
```

```
systemctl enable polkadot
systemctl start polkadot
systemctl status polkadot
```

## Install Nodejs 12

```
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt -y install nodejs
```

## Install MariaDB 10.4

```
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
add-apt-repository "deb [arch=amd64,arm64,ppc64el] http://mariadb.mirror.liquidtelecom.com/repo/10.4/ubuntu $(lsb_release -cs) main"
apt update
apt -y install mariadb-server mariadb-client
mysql_secure_installation
```

## Generate SSL certificate

```
apt -y install nginx
add-apt-repository ppa:certbot/certbot
apt update
apt -y install python-certbot-nginx
```

Modify `/etc/nginx/sites-available/default` to include:

```
root /usr/local/polkastats-v2/dist/;
server_name yourdomain.com;
```

```
systemctl reload nginx
certbot --nginx -d yourdomain.com
```

## Install PolkaStats backend

```
cd /usr/local
git clone https://github.com/Colm3na/polkastats-backend-v2.git
cd polkastats-backend-v2
npm install
cat sql/polkastats.sql | mysql -u root
```

## PolkaStats backend systemd service

```
nano /etc/systemd/system/polkastats.service
```

```
[Unit]
Description=PolkaStats v2 backend

[Service]
ExecStart=/usr/bin/node /usr/local/polkastats-backend-v2/index.js
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=polkastats-backend
#User=<alternate user>
#Group=<alternate group>
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```
systemctl enable polkastats
```

## PolkaStats blocks crawler systemd service

```
nano /etc/systemd/system/polkablocks.service
```

```
[Unit]
Description=PolkaStats backend v2 - blocks crawler

[Service]
ExecStart=/usr/bin/node /usr/local/polkastats-backend-v2/crawlers/blocks.js
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=polkastats-backend
#User=<alternate user>
#Group=<alternate group>
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```
systemctl enable polkablocks
```

## PolkaStats system events crawler systemd service

```
nano /etc/systemd/system/polkaevents.service
```

```
[Unit]
Description=PolkaStats backend v2 - events crawler

[Service]
ExecStart=/usr/bin/node /usr/local/polkastats-backend-v2/crawlers/events.js
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=polkastats-backend
#User=<alternate user>
#Group=<alternate group>
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```
systemctl enable polkaevents
```

## Install PolkaStats frontend

```
cd /usr/local
cd polkastats-v2
npm install
npm run build
```

## Edit backend SSL configuration files

```
module.exports = {
  // Enable CORS
  enableCORS: true,
  // Backend port
  backendPort: 8443,
  // Local Polkadot Kusama node
  wsProviderUrl: 'ws://127.0.0.1:9944',
  // MySQL database connection params
  mysqlConnParams: {
    host: "localhost",
    user: "polkastats",
    password: "polkastats",
    database: "polkastats",
    multipleStatements: true,
    charset : "utf8mb4"
  },
  // SSL certificate files
  privateKeyFile: '/etc/letsencrypt/live/yourdomain.com/privkey.pem',
  certificateFile: '/etc/letsencrypt/live/yourdomain.com/cert.pem',
  caFile: '/etc/letsencrypt/live/yourdomain.com/chain.pem'
}
```

## Edit frontend configuration file

`/usr/local/polkastats-v2/polkastats.config.js`

```
/* PolkaStats app configuration params */
export const unit = `KSM`;
export const decimals = 12;
export const backendBaseURL = `https://yourdomain.com:8443`;
export const blockExplorer = {
  block: `https://polkascan.io/pre/kusama-cc3/block/`,
  account: `https://polkascan.io/pre/kusama-cc3/account/`
};
```

## Install modified offline-phragmen

```
cd /usr/local
git clone https://github.com/mariopino/offline-phragmen
mv offline-phragmen mario-offline-phragmen
cd mario-offline-phragmen
cargo build --release
```

## Copy blockchain from other synced polkadot node

```
cd .local/share/polkadot/chains
tar cvzf ksmcc3.tar.gz ksmcc3
```

Copy and replace `.local/share/polkadot/chains/ksmcc3` folder in target node.

# And once Polkadot node is synced ....

## Include cron tasks

Include in `/etc/crontab`:

```
## PolkaStats backend v2 crawlers
* *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/intention.js 2>&1 >/dev/null
* *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/validator.js 2>&1 >/dev/null

# Execute chain.js crawler every 10s
* *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null
* *  * * *   root     sleep 10 && node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null
* *  * * *   root     sleep 20 && node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null
* *  * * *   root     sleep 30 && node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null
* *  * * *   root     sleep 40 && node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null
* *  * * *   root     sleep 50 && node /usr/local/polkastats-backend-v2/crawlers/chain.js 2>&1 >/dev/null

# Execute every 1m
*/1 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/phragmen.js 2>&1 >/dev/null

# Execute every 5m
*/5 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/intention_bonded.js 2>&1 >/dev/null
*/5 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/validator_bonded.js 2>&1 >/dev/null
*/5 *  * * *   root     /usr/local/polkastats-backend-v2/nicknames.sh 2>&1 >/dev/null
*/5 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/index.js 2>&1 >/dev/null
*/5 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/account.js 2>&1 >/dev/null

# Execute every 10m
*/10 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/keybase_identity.js 2>&1 >/dev/null

# Execute every hour
0 *  * * *   root     node /usr/local/polkastats-backend-v2/crawlers/system.js 2>&1 >/dev/null
```

## Start everything

```
systemctl start polkastats
systemctl start polkaevents
systemctl start polkablocks
```

## Enjoy!

Open in your browser `https//yourdomain.com` and enjoy your fresh installed PolkaStats! ;-)


