#!/usr/bin/env node

/**
 * Pull Figma Variables → Token JSON Files
 *
 * Fetches variables from Figma API and writes them to local token files.
 * Usage: npm run pull:figma
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = path.resolve(__dirname, '../tokens/alias');

// Load environment variables from .env file
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

async function fetchFigmaVariables(fileKey, token) {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;

  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': token
    }
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function transformToTokenFormat(figmaData, modeName) {
  const { meta } = figmaData;
  const { variables, variableCollections } = meta;

  // Find the semantic collection and mode
  const semanticCollection = Object.values(variableCollections).find(
    c => c.name.toLowerCase().includes('semantic')
  );

  if (!semanticCollection) {
    throw new Error('Could not find semantic variable collection in Figma');
  }

  const modeId = Object.entries(semanticCollection.modes).find(
    ([, name]) => name.toLowerCase().includes(modeName.toLowerCase())
  )?.[0];

  if (!modeId) {
    throw new Error(`Could not find mode "${modeName}" in semantic collection`);
  }

  const tokens = {};

  for (const variable of Object.values(variables)) {
    if (variable.variableCollectionId !== semanticCollection.id) continue;
    if (variable.resolvedType !== 'COLOR') continue;

    const value = variable.valuesByMode[modeId];
    if (!value) continue;

    // Parse the variable name path (e.g., "color/bg/default")
    const nameParts = variable.name.split('/');

    // Build nested structure
    let current = tokens;
    for (let i = 0; i < nameParts.length - 1; i++) {
      const part = nameParts[i];
      if (!current[part]) current[part] = {};
      current = current[part];
    }

    const finalKey = nameParts[nameParts.length - 1];

    // Convert Figma color format to token format
    let tokenValue;
    if (typeof value === 'object' && 'r' in value) {
      const hex = rgbToHex(value.r, value.g, value.b);
      tokenValue = {
        colorSpace: 'srgb',
        components: [value.r, value.g, value.b],
        alpha: value.a ?? 1,
        hex
      };
    } else {
      // Handle alias references
      tokenValue = value;
    }

    current[finalKey] = {
      $type: 'color',
      $value: tokenValue,
      $extensions: {
        'com.figma.variableId': variable.id,
        'com.figma.scopes': variable.scopes || [],
        'com.figma.isOverride': true
      }
    };
  }

  // Add mode extension
  tokens.$extensions = {
    'com.figma.modeName': `semantic.${modeName}`
  };

  return tokens;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

async function main() {
  console.log('Pulling variables from Figma...\n');

  const env = loadEnv();
  const { FIGMA_TOKEN, FIGMA_FILE_KEY } = env;

  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('Error: FIGMA_TOKEN and FIGMA_FILE_KEY must be set in tokens/.env');
    process.exit(1);
  }

  try {
    const figmaData = await fetchFigmaVariables(FIGMA_FILE_KEY, FIGMA_TOKEN);

    // Generate light mode tokens
    const lightTokens = transformToTokenFormat(figmaData, 'light');
    const lightPath = path.join(TOKENS_DIR, 'semantic.light.tokens.json');
    fs.writeFileSync(lightPath, JSON.stringify(lightTokens, null, 2));
    console.log(`✓ Written: ${path.relative(process.cwd(), lightPath)}`);

    // Generate dark mode tokens
    const darkTokens = transformToTokenFormat(figmaData, 'dark');
    const darkPath = path.join(TOKENS_DIR, 'semantic.dark.tokens.json');
    fs.writeFileSync(darkPath, JSON.stringify(darkTokens, null, 2));
    console.log(`✓ Written: ${path.relative(process.cwd(), darkPath)}`);

    console.log('\nPull complete! Run `npm run build` to regenerate CSS/Sass.');
  } catch (error) {
    console.error('Error pulling from Figma:', error.message);
    process.exit(1);
  }
}

main();
