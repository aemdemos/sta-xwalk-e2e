const fs = require('fs');
const jwtAuth = require('@adobe/jwt-auth');

// Read and parse the credentials
const credsRaw = JSON.parse(fs.readFileSync(process.env.SERVICE_CREDENTIALS_PATH, 'utf8'));
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