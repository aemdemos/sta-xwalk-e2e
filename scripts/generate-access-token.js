const fs = require('fs');
const jwtAuth = require('@adobe/jwt-auth');

// Read and parse the credentials
const fileContent = fs.readFileSync(process.env.SERVICE_CREDENTIALS_PATH, 'utf8');
console.log('Raw credentials JSON:', fileContent);
const credsRaw = JSON.parse(fileContent);
const integration = credsRaw.integration || {};
const technicalAccount = integration.technicalAccount || {};

const config = {
  clientId: technicalAccount.clientId,
  clientSecret: technicalAccount.clientSecret,
  technicalAccountId: integration.id,
  orgId: integration.org,
  privateKey: integration.privateKey,
  metaScopes: [integration.metascopes], // wrap as array if it's a string
  ims: `https://${integration.imsEndpoint}`,
};

jwtAuth(config)
  .then((response) => {
    // response.access_token is your access token
    const output = `access_token=${response.access_token}\n`;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  })
  .catch((err) => {
    // Optionally log error (but redact sensitive info)
    process.exit(1);
  });