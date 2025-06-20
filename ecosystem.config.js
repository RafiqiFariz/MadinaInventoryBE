module.exports = {
  apps: [
    {
      name: 'madina-inventory-be',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
