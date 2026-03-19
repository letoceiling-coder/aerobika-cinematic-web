const https = require('https');

const data = JSON.stringify({
  email: 'dsc-23@yandex.ru',
  password: '123123123'
});

const options = {
  hostname: 'azotrostovskiy.ru',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('Response:', JSON.stringify(json, null, 2));
      if (json.access_token) {
        console.log('\\nвњ… LOGIN SUCCESS');
      } else {
        console.log('\\nвќЊ LOGIN FAILED');
      }
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
