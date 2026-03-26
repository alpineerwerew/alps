/**
 * PM2 : catalogue (web) et Telegram (bot) séparés — le catalogue reste joignable
 * même si le polling Telegram ralentit ou se bloque.
 *
 * Sur le VPS :
 *   cd /opt/alps/server
 *   pm2 delete alps-bot  # si ancien nom unique
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'alps-web',
      script: 'index.js',
      cwd: __dirname,
      env: { PROCESS_ROLE: 'web' },
      max_memory_restart: '450M'
    },
    {
      name: 'alps-bot',
      script: 'index.js',
      cwd: __dirname,
      env: { PROCESS_ROLE: 'bot' },
      max_memory_restart: '450M'
    }
  ]
};
