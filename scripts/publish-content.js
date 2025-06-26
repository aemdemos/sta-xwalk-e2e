/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const fs = require('fs');
const jwtAuth = require('@adobe/jwt-auth');

/**
 * Replicates content using AEM /bin/replicate endpoint
 * @param {string} accessToken - JWT access token
 * @param {string} aemUrl - AEM instance URL
 * @param {string[]} contentPaths - Array of content paths to replicate
 * @param {string} replicateType - Type of replication (activate, deactivate, delete)
 * @param {boolean} isPreview - Whether to replicate to preview or publish
 * @returns {Promise<Object>}
 */
async function replicateContent(accessToken, aemUrl, contentPaths, replicateType = 'activate', isPreview = false) {
  const replicateUrl = `${aemUrl}/bin/replicate`;

  const targetType = isPreview ? 'preview' : 'publish';
  console.log(`📤 Replicating ${contentPaths.length} content path(s) to ${targetType} via ${aemUrl}`);
  console.log(`🔗 Using endpoint: ${replicateUrl}`);

  const payload = {
    cmd: replicateType,
    path: contentPaths,
    synchronous: false,
    ignoredeactivated: true,
    onlymodified: false,
    onlynewer: false,
    target: targetType,
  };

  console.log('📋 Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(replicateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Replication to ${targetType} completed successfully`);
    console.log('📊 Response:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error(`❌ Replication to ${targetType} failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Check if required environment variables are set
    const serviceCredentialsPath = process.env.SERVICE_CREDENTIALS_PATH || './service-credentials.json';
    const aemUrl = process.env.AEM_URL;
    const contentPathsInput = process.env.CONTENT_PATHS;
    const replicateType = process.env.REPLICATE_TYPE || 'activate';
    const isPreview = process.env.IS_PREVIEW === 'true';

    if (!aemUrl) {
      throw new Error('AEM_URL environment variable is required');
    }
    if (!contentPathsInput) {
      throw new Error('CONTENT_PATHS environment variable is required');
    }

    // Parse content paths
    const contentPaths = contentPathsInput.split(',').map((path) => path.trim()).filter((path) => path);

    if (contentPaths.length === 0) {
      throw new Error('No valid content paths provided');
    }

    const targetType = isPreview ? 'preview' : 'publish';
    console.log(`🚀 Starting AEM replication to ${targetType}`);
    console.log(`📍 AEM URL: ${aemUrl}`);
    console.log(`📁 Content paths: ${contentPaths.join(', ')}`);
    console.log(`🔧 Replicate type: ${replicateType}`);
    console.log(`🎯 Target: ${targetType}`);

    // Generate access token
    console.log('🔑 Generating access token...');
    const fileContent = fs.readFileSync(serviceCredentialsPath, 'utf8');
    const credsRaw = JSON.parse(fileContent);
    const integration = credsRaw.integration || {};
    const technicalAccount = integration.technicalAccount || {};

    const config = {
      clientId: technicalAccount.clientId,
      clientSecret: technicalAccount.clientSecret,
      technicalAccountId: integration.id,
      orgId: integration.org,
      privateKey: integration.privateKey,
      metaScopes: [integration.metascopes],
      ims: `https://${integration.imsEndpoint}`,
    };

    const authResponse = await jwtAuth(config);
    const accessToken = authResponse.access_token;

    console.log('✅ Access token generated successfully');

    // Perform the replication operation
    await replicateContent(accessToken, aemUrl, contentPaths, replicateType, isPreview);

    console.log(`🎉 AEM replication to ${targetType} completed successfully`);
  } catch (error) {
    console.error(`💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
