const fs = require('fs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const creds = JSON.parse(fs.readFileSync(process.env.SERVICE_CREDENTIALS_PATH, 'utf8'));

const payload = {
  iss: creds.client_id,
  sub: creds.technical_account_id,
  aud: `https://ims-na1.adobelogin.com/c/${creds.client_id}`,
  [`https://ims-na1.adobelogin.com/s/${creds.metascopes[0]}`]: true,
};

const token = jwt.sign(payload, creds.private_key, { algorithm: 'RS256', expiresIn: '5m' });

fetch('https://ims-na1.adobelogin.com/ims/exchange/jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    jwt_token: token,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.access_token) {
      const output = `access_token=${data.access_token}\n`;
      fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
    } else {
      process.exit(1);
    }
  });