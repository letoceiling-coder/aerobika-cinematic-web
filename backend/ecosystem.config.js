module.exports = {
  apps: [{
    name: 'azot-backend',
    script: 'dist/src/main.js',
    cwd: '/var/www/azotrostovskiy.ru/backend/backend',
    env: {
      NODE_ENV: 'production',
      PORT: '3000',
      TELEGRAM_BOT_TOKEN: '8679452544:AAHBfnGsNmqyj3rfY69LnaK8ZUjGHCKFlQs'
    }
  }]
};
