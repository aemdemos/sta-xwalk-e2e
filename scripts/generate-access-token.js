const fs = require('fs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const credsRaw = JSON.parse(fs.readFileSync(process.env.SERVICE_CREDENTIALS_PATH, 'utf8'));

// Extract fields from the custom format
const integration = credsRaw.integration || {};
const technicalAccount = integration.technicalAccount || {};

const client_id = technicalAccount.clientId;
const client_secret = technicalAccount.clientSecret;
const technical_account_id = integration.id;
const org_id = integration.org;
const private_key = integration.privateKey;
const metascopes = [integration.metascopes]; // assuming it's a string, wrap in array

const payload = {
  iss: client_id,
  sub: technical_account_id,
  aud: `https://ims-na1.adobelogin.com/c/${client_id}`,
  [`https://ims-na1.adobelogin.com/s/${metascopes[0]}`]: true,
};

const token = jwt.sign(payload, private_key, { algorithm: 'RS256', expiresIn: '5m' });

fetch('https://ims-na1.adobelogin.com/ims/exchange/jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
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