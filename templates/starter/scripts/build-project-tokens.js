#!/usr/bin/env node

/**
 * Build Project Token Overrides
 *
 * Generates CSS custom property overrides from project-specific token file.
 * Run this before building the main Sass.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OVERRIDES_FILE = path.resolve(__dirname, '../tokens/alias-overrides.json');
const OUTPUT_DIR = path.resolve(__dirname, '../tokens/generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '_overrides.scss');

function flattenTokens(obj, prefix = '') {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const tokenPath = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === 'object' && '$type' in value) {
      result.push({ name: tokenPath, token: value });
    } else if (value && typeof value === 'object') {
      result.push(...flattenTokens(value, tokenPath));
    }
  }

  return result;
}

function getTokenValue(token) {
  const value = token.$value;
  const type = token.$type;

  if (type === 'color') {
    if (typeof value === 'object' && value.hex) {
      return value.hex;
    }
    return value;
  }

  if (type === 'number') {
    return `${value}px`;
  }

  if (type === 'string') {
    return value;
  }

  return value;
}

function main() {
  console.log('Building project token overrides...\n');

  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Check if overrides file exists
    if (!fs.existsSync(OVERRIDES_FILE)) {
      console.log('No alias-overrides.json found, creating empty overrides file.');
      fs.writeFileSync(OUTPUT_FILE, '// No project token overrides\n');
      return;
    }

    const overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    const tokens = flattenTokens(overrides);

    if (tokens.length === 0) {
      fs.writeFileSync(OUTPUT_FILE, '// No project token overrides\n');
      console.log('No token overrides found.');
      return;
    }

    const lines = [
      '// Auto-generated project token overrides',
      '// DO NOT EDIT - Run `npm run build:tokens` to regenerate',
      '',
      ':root {'
    ];

    for (const { name, token } of tokens) {
      const value = getTokenValue(token);
      lines.push(`  --${name}: ${value};`);
    }

    lines.push('}');

    fs.writeFileSync(OUTPUT_FILE, lines.join('\n'));
    console.log(`✓ Generated: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
    console.log(`  ${tokens.length} override(s) applied`);

  } catch (error) {
    console.error('Error building token overrides:', error.message);
    process.exit(1);
  }
}

main();
