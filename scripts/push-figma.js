#!/usr/bin/env node

/**
 * Push Token JSON Files → Figma Variables
 *
 * Reads local token files and creates/updates variables in Figma.
 * Usage: npm run push:figma
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = path.resolve(__dirname, '../tokens/alias');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../tokens/.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: tokens/.env file not found');
    console.error('Create tokens/.env with FIGMA_TOKEN and FIGMA_FILE_KEY');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
  return env;
}

function readTokenFile(filename) {
  const filePath = path.join(TOKENS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Token file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function flattenTokens(obj, prefix = '') {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const tokenPath = prefix ? `${prefix}/${key}` : key;

    if (value && typeof value === 'object' && '$type' in value) {
      result.push({ path: tokenPath, token: value });
    } else if (value && typeof value === 'object') {
      result.push(...flattenTokens(value, tokenPath));
    }
  }

  return result;
}

function tokenToFigmaColor(token) {
  const value = token.$value;

  if (value.components) {
    return {
      r: value.components[0],
      g: value.components[1],
      b: value.components[2],
      a: value.alpha ?? 1
    };
  }

  if (value.hex) {
    const hex = value.hex.replace('#', '');
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1
    };
  }

  throw new Error('Cannot convert token value to Figma color format');
}

async function getFigmaVariables(fileKey, token) {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;

  const response = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function pushToFigma(fileKey, token, payload) {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Figma API error: ${response.status} ${response.statusText}\n${errorBody}`);
  }

  return response.json();
}

async function main() {
  console.log('Pushing tokens to Figma...\n');

  const env = loadEnv();
  const { FIGMA_TOKEN, FIGMA_FILE_KEY } = env;

  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('Error: FIGMA_TOKEN and FIGMA_FILE_KEY must be set in tokens/.env');
    process.exit(1);
  }

  try {
    // Read local token files
    const lightTokens = readTokenFile('semantic.light.tokens.json');
    const darkTokens = readTokenFile('semantic.dark.tokens.json');

    // Flatten to get all tokens with paths
    const lightFlat = flattenTokens(lightTokens);
    const darkFlat = flattenTokens(darkTokens);

    // Get existing Figma variables
    console.log('Fetching existing Figma variables...');
    const figmaData = await getFigmaVariables(FIGMA_FILE_KEY, FIGMA_TOKEN);
    const { variables, variableCollections } = figmaData.meta;

    // Find or create semantic collection
    let semanticCollection = Object.values(variableCollections).find(
      c => c.name.toLowerCase().includes('semantic')
    );

    const variableUpdates = [];
    const variableCreates = [];

    // Find mode IDs
    const lightModeId = semanticCollection
      ? Object.entries(semanticCollection.modes).find(([, name]) =>
          name.toLowerCase().includes('light')
        )?.[0]
      : null;

    const darkModeId = semanticCollection
      ? Object.entries(semanticCollection.modes).find(([, name]) =>
          name.toLowerCase().includes('dark')
        )?.[0]
      : null;

    // Build a map of existing variables by name
    const existingVars = {};
    for (const v of Object.values(variables)) {
      if (v.variableCollectionId === semanticCollection?.id) {
        existingVars[v.name] = v;
      }
    }

    // Process light tokens
    for (const { path, token } of lightFlat) {
      const existingVar = existingVars[path];
      const figmaColor = tokenToFigmaColor(token);

      if (existingVar) {
        variableUpdates.push({
          id: existingVar.id,
          name: path,
          variableCollectionId: semanticCollection.id,
          resolvedType: 'COLOR',
          valuesByMode: {
            ...(lightModeId && { [lightModeId]: figmaColor })
          }
        });
      } else {
        variableCreates.push({
          name: path,
          variableCollectionId: semanticCollection?.id,
          resolvedType: 'COLOR',
          valuesByMode: {
            ...(lightModeId && { [lightModeId]: figmaColor })
          }
        });
      }
    }

    // Process dark tokens (update values for dark mode)
    for (const { path, token } of darkFlat) {
      const existingVar = existingVars[path];
      const figmaColor = tokenToFigmaColor(token);

      if (existingVar && darkModeId) {
        const existingUpdate = variableUpdates.find(u => u.id === existingVar.id);
        if (existingUpdate) {
          existingUpdate.valuesByMode[darkModeId] = figmaColor;
        } else {
          variableUpdates.push({
            id: existingVar.id,
            name: path,
            variableCollectionId: semanticCollection.id,
            resolvedType: 'COLOR',
            valuesByMode: {
              [darkModeId]: figmaColor
            }
          });
        }
      }
    }

    // Build the API payload
    const payload = {};

    if (variableCreates.length > 0) {
      payload.variables = variableCreates;
    }

    if (variableUpdates.length > 0) {
      payload.variableModeValues = [];
      for (const update of variableUpdates) {
        for (const [modeId, value] of Object.entries(update.valuesByMode)) {
          payload.variableModeValues.push({
            variableId: update.id,
            modeId,
            value
          });
        }
      }
    }

    if (Object.keys(payload).length === 0) {
      console.log('No changes to push.');
      return;
    }

    // Push to Figma
    console.log(`Pushing ${variableUpdates.length} updates, ${variableCreates.length} new variables...`);
    await pushToFigma(FIGMA_FILE_KEY, FIGMA_TOKEN, payload);

    console.log('\n✓ Push complete! Variables updated in Figma.');
  } catch (error) {
    console.error('Error pushing to Figma:', error.message);
    process.exit(1);
  }
}

main();
