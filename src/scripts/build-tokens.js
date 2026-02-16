#!/usr/bin/env node

/**
 * Build base color tokens → CSS custom properties
 *
 * Reads ~/Projects/design/tokens/base/colors.tokens.json
 * and outputs dist/css/tokens.css with --{color}-{shade} variables.
 *
 * Usage: node src/scripts/build-tokens.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = path.resolve(
  process.env.HOME,
  'Projects/design/tokens/base/colors.tokens.json'
);
const DIST_DIR = path.resolve(__dirname, '../../dist/css');

const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));

const lines = ['/* Auto-generated from base color tokens — DO NOT EDIT */', ':root {'];

for (const [color, shades] of Object.entries(tokens)) {
  for (const [shade, token] of Object.entries(shades)) {
    if (token && token.$value) {
      lines.push(`  --${color}-${shade}: ${token.$value};`);
    }
  }
}

lines.push('}', '');

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, 'tokens.css'), lines.join('\n'));
console.log('  tokens.css generated');
