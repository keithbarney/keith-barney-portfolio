#!/usr/bin/env node

/**
 * Build Token JSON Files → CSS + Sass
 *
 * Generates both CSS custom properties and Sass variables from token files.
 * Supports project overrides via alias-overrides.json.
 *
 * Usage: npm run build
 *        npm run build -- --project-overrides=/path/to/alias-overrides.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_TOKENS_DIR = path.resolve(__dirname, '../tokens/base');
const ALIAS_TOKENS_DIR = path.resolve(__dirname, '../tokens/alias');
const OUTPUT_DIR = path.resolve(__dirname, '../tokens/dist');

// Parse command line args for project overrides
const args = process.argv.slice(2);
const overridesArg = args.find(arg => arg.startsWith('--project-overrides='));
const projectOverridesPath = overridesArg ? overridesArg.split('=')[1] : null;

function readTokenFile(dir, filename) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key.startsWith('$')) continue;
    if (source[key] && typeof source[key] === 'object' && !('$value' in source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

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

  // Handle color tokens
  if (type === 'color') {
    if (typeof value === 'object') {
      if (value.hex) return value.hex;
      if (value.components) {
        const [r, g, b] = value.components.map(c => Math.round(c * 255));
        const a = value.alpha ?? 1;
        if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
        const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    }
    return value;
  }

  // Handle number tokens (spacing, radius, font-size)
  if (type === 'number') {
    return `${value}px`;
  }

  // Handle string tokens (font-family)
  if (type === 'string') {
    return value;
  }

  return value;
}

function toSassVariable(name) {
  return `$${name.replace(/\//g, '-')}`;
}

function toCssVariable(name) {
  return `--${name.replace(/\//g, '-')}`;
}

function generateCss(lightTokens, darkTokens, baseTokens, aliasTokens, overrides) {
  const lines = [
    '/* Auto-generated from token files - DO NOT EDIT */',
    '/* Run `npm run build` to regenerate */',
    ''
  ];

  // Apply overrides to light and dark tokens
  const finalLightTokens = overrides ? deepMerge(lightTokens, overrides) : lightTokens;
  const finalDarkTokens = overrides ? deepMerge(darkTokens, overrides) : darkTokens;

  const lightFlat = flattenTokens(finalLightTokens);
  const darkFlat = flattenTokens(finalDarkTokens);

  // Generate :root with light mode as default
  lines.push(':root {');
  lines.push('  /* Light mode (default) */');

  const categories = {};
  for (const { name, token } of lightFlat) {
    const category = name.split('-')[0];
    if (!categories[category]) categories[category] = [];
    categories[category].push({ name, token });
  }

  for (const [category, tokens] of Object.entries(categories)) {
    lines.push(`  /* ${category} */`);
    for (const { name, token } of tokens) {
      const value = getTokenValue(token);
      lines.push(`  ${toCssVariable(name)}: ${value};`);
    }
  }
  lines.push('}');

  // Generate dark mode
  lines.push('');
  lines.push('[data-theme="dark"] {');

  const darkCategories = {};
  for (const { name, token } of darkFlat) {
    const category = name.split('-')[0];
    if (!darkCategories[category]) darkCategories[category] = [];
    darkCategories[category].push({ name, token });
  }

  for (const [category, tokens] of Object.entries(darkCategories)) {
    lines.push(`  /* ${category} */`);
    for (const { name, token } of tokens) {
      const value = getTokenValue(token);
      lines.push(`  ${toCssVariable(name)}: ${value};`);
    }
  }
  lines.push('}');

  return lines.join('\n');
}

function generateSass(lightTokens, darkTokens, baseTokens, aliasTokens, overrides) {
  const lines = [
    '// Auto-generated from token files - DO NOT EDIT',
    '// Run `npm run build` to regenerate',
    ''
  ];

  // Base tokens as Sass variables
  lines.push('// ===== BASE TOKENS =====');

  // Colors
  const colorsTokens = readTokenFile(BASE_TOKENS_DIR, 'colors.tokens.json');
  if (colorsTokens) {
    for (const [colorName, shades] of Object.entries(colorsTokens)) {
      if (colorName.startsWith('$')) continue;
      for (const [shade, token] of Object.entries(shades)) {
        if (shade.startsWith('$')) continue;
        const value = getTokenValue(token);
        lines.push(`$color-${colorName}-${shade}: ${value};`);
      }
    }
  }

  // Scale/Spacing
  const scaleTokens = readTokenFile(BASE_TOKENS_DIR, 'scale.tokens.json');
  if (scaleTokens) {
    lines.push('');
    lines.push('// Scale');
    for (const [name, token] of Object.entries(scaleTokens)) {
      if (name.startsWith('$')) continue;
      const value = getTokenValue(token);
      lines.push(`$spacing-${name}: ${value};`);
    }
  }

  // Typography (base)
  const typographyBaseTokens = readTokenFile(BASE_TOKENS_DIR, 'typography.tokens.json');
  if (typographyBaseTokens) {
    lines.push('');
    lines.push('// Typography');
    if (typographyBaseTokens.Family) {
      for (const [name, token] of Object.entries(typographyBaseTokens.Family)) {
        if (name.startsWith('$')) continue;
        lines.push(`$font-family-${name}: "${token.$value}";`);
      }
    }
    if (typographyBaseTokens.Weights) {
      for (const [name, token] of Object.entries(typographyBaseTokens.Weights)) {
        if (name.startsWith('$')) continue;
        lines.push(`$font-weight-${name.toLowerCase()}: ${token.$value};`);
      }
    }
  }

  // Radius (base)
  const radiusBaseTokens = readTokenFile(BASE_TOKENS_DIR, 'radius.tokens.json');
  if (radiusBaseTokens) {
    lines.push('');
    lines.push('// Radius');
    for (const [name, token] of Object.entries(radiusBaseTokens)) {
      if (name.startsWith('$')) continue;
      const value = getTokenValue(token);
      lines.push(`$radius-${name}: ${value};`);
    }
  }

  // Alias tokens
  lines.push('');
  lines.push('// ===== ALIAS TOKENS =====');

  // Typography alias
  const typographyAliasTokens = readTokenFile(ALIAS_TOKENS_DIR, 'typography.tokens.json');
  if (typographyAliasTokens) {
    lines.push('');
    lines.push('// Typography Alias');
    if (typographyAliasTokens['font-family']) {
      for (const [name, token] of Object.entries(typographyAliasTokens['font-family'])) {
        if (name.startsWith('$')) continue;
        lines.push(`$alias-font-${name}: "${token.$value}";`);
      }
    }
    if (typographyAliasTokens['font-size']) {
      for (const [name, token] of Object.entries(typographyAliasTokens['font-size'])) {
        if (name.startsWith('$')) continue;
        const value = getTokenValue(token);
        lines.push(`$font-size-${name}: ${value};`);
      }
    }
  }

  // Spacing alias
  const spacingAliasTokens = readTokenFile(ALIAS_TOKENS_DIR, 'spacing.tokens.json');
  if (spacingAliasTokens) {
    lines.push('');
    lines.push('// Spacing Alias');
    if (spacingAliasTokens.gap) {
      for (const [name, token] of Object.entries(spacingAliasTokens.gap)) {
        if (name.startsWith('$')) continue;
        const value = getTokenValue(token);
        lines.push(`$gap-${name}: ${value};`);
      }
    }
    if (spacingAliasTokens.padding) {
      for (const [name, token] of Object.entries(spacingAliasTokens.padding)) {
        if (name.startsWith('$')) continue;
        const value = getTokenValue(token);
        lines.push(`$padding-${name}: ${value};`);
      }
    }
  }

  // Radius alias
  const radiusAliasTokens = readTokenFile(ALIAS_TOKENS_DIR, 'radius.tokens.json');
  if (radiusAliasTokens && radiusAliasTokens.container) {
    lines.push('');
    lines.push('// Radius Alias');
    for (const [name, token] of Object.entries(radiusAliasTokens.container)) {
      if (name.startsWith('$')) continue;
      const value = getTokenValue(token);
      lines.push(`$radius-${name}: ${value};`);
    }
  }

  // UI colors (light and dark)
  lines.push('');
  lines.push('// ===== UI COLORS =====');

  const finalLightTokens = overrides ? deepMerge(lightTokens, overrides) : lightTokens;
  const finalDarkTokens = overrides ? deepMerge(darkTokens, overrides) : darkTokens;

  // Light mode
  lines.push('');
  lines.push('// Light Mode');
  const lightFlat = flattenTokens(finalLightTokens);
  for (const { name, token } of lightFlat) {
    const value = getTokenValue(token);
    lines.push(`$alias-light-${name}: ${value};`);
  }

  // Dark mode
  lines.push('');
  lines.push('// Dark Mode');
  const darkFlat = flattenTokens(finalDarkTokens);
  for (const { name, token } of darkFlat) {
    const value = getTokenValue(token);
    lines.push(`$alias-dark-${name}: ${value};`);
  }

  return lines.join('\n');
}

function main() {
  console.log('Building tokens from JSON files...\n');

  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read token files
    const lightTokens = readTokenFile(ALIAS_TOKENS_DIR, 'ui.light.tokens.json') || {};
    const darkTokens = readTokenFile(ALIAS_TOKENS_DIR, 'ui.dark.tokens.json') || {};
    const baseTokens = {};
    const aliasTokens = {};

    // Read project overrides if specified
    let overrides = null;
    if (projectOverridesPath && fs.existsSync(projectOverridesPath)) {
      overrides = JSON.parse(fs.readFileSync(projectOverridesPath, 'utf-8'));
      console.log(`✓ Loaded project overrides from: ${projectOverridesPath}`);
    }

    // Generate CSS
    const css = generateCss(lightTokens, darkTokens, baseTokens, aliasTokens, overrides);
    const cssPath = path.join(OUTPUT_DIR, 'tokens.css');
    fs.writeFileSync(cssPath, css);
    console.log(`✓ Generated: ${path.relative(process.cwd(), cssPath)}`);

    // Generate Sass
    const sass = generateSass(lightTokens, darkTokens, baseTokens, aliasTokens, overrides);
    const sassPath = path.join(OUTPUT_DIR, '_tokens.scss');
    fs.writeFileSync(sassPath, sass);
    console.log(`✓ Generated: ${path.relative(process.cwd(), sassPath)}`);

    // Count tokens
    const lightCount = flattenTokens(lightTokens).length;
    const darkCount = flattenTokens(darkTokens).length;
    console.log(`\n  UI tokens: ${lightCount} (light) / ${darkCount} (dark)`);

  } catch (error) {
    console.error('Error building tokens:', error.message);
    process.exit(1);
  }
}

main();
