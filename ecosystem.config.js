module.exports = {
  apps: [
    {
      name: 'madina-inventory-app',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
