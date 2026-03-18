// PM2 Ecosystem file for production
module.exports = {
  apps: [
    {
      name: 'n2o-backend',
      script: './backend/dist/main.js',
      cwd: '/home/murashun/murashun.beget.tech/public_html',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
