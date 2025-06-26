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

import core from '@actions/core';

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
  core.info(`📤 Replicating ${contentPaths.length} content path(s) to ${targetType} via ${aemUrl}`);
  core.info(`🔗 Using endpoint: ${replicateUrl}`);
  
  const payload = {
    cmd: replicateType,
    path: contentPaths,
    synchronous: false,
    ignoredeactivated: true,
    onlymodified: false,
    onlynewer: false,
    target: targetType
  };

  core.info(`📋 Payload: ${JSON.stringify(payload, null, 2)}`);

  try {
    const response = await fetch(replicateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    core.info(`✅ Replication to ${targetType} completed successfully`);
    core.info(`📊 Response: ${JSON.stringify(result, null, 2)}`);
    
    return result;
  } catch (error) {
    core.error(`❌ Replication to ${targetType} failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main function for the GitHub Action
 * @returns {Promise<void>}
 */
export async function run() {
  try {
    const accessToken = core.getInput('access_token');
    const aemUrl = core.getInput('aem_url');
    const contentPathsInput = core.getInput('content_paths');
    const replicateType = core.getInput('replicate_type') || 'activate';
    const isPreview = core.getInput('is_preview') === 'true';

    // Validate inputs
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    if (!aemUrl) {
      throw new Error('AEM URL is required');
    }
    if (!contentPathsInput) {
      throw new Error('Content paths are required');
    }

    // Parse content paths
    const contentPaths = contentPathsInput.split(',').map(path => path.trim()).filter(path => path);
    
    if (contentPaths.length === 0) {
      throw new Error('No valid content paths provided');
    }

    const targetType = isPreview ? 'preview' : 'publish';
    core.info(`🚀 Starting AEM replication to ${targetType}`);
    core.info(`📍 AEM URL: ${aemUrl}`);
    core.info(`📁 Content paths: ${contentPaths.join(', ')}`);
    core.info(`🔧 Replicate type: ${replicateType}`);
    core.info(`🎯 Target: ${targetType}`);

    // Perform the replication operation
    await replicateContent(accessToken, aemUrl, contentPaths, replicateType, isPreview);
    
    core.info(`🎉 AEM replication to ${targetType} completed successfully`);
  } catch (error) {
    const errorMessage = `Failed to replicate content: ${error.message}`;
    core.error(errorMessage);
    core.setOutput('error_message', errorMessage);
    process.exit(1);
  }
}

await run(); 