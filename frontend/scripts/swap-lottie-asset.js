#!/usr/bin/env node
/**
 * Swap an embedded image asset inside the M12 hero Lottie animation.
 *
 * The Lottie file (hero-animation.json) bakes several PNG layers in as base64
 * data URIs (orbiting logos, icons, rings). This script replaces one of them
 * with a PNG of your choice, keeping the animation otherwise intact.
 *
 * Usage:
 *   node swap-lottie-asset.js                       # list swappable assets
 *   node swap-lottie-asset.js typeface.png my-logo.png
 *   node swap-lottie-asset.js sgnl.png ./portfolio/logo-new.png
 *
 * After swapping, run `frontend/scripts/sync-plugin.sh` to rebuild and push
 * the updated JSON into the WordPress plugin.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LOTTIE = resolve(HERE, '../assets/images/m12/hero-animation.json');

function pngDimensions(buf) {
  // PNG IHDR: width and height are big-endian uint32 at byte offsets 16 and 20.
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('Replacement file is not a valid PNG.');
  }
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function main() {
  const args = process.argv.slice(2);
  const lottie = JSON.parse(readFileSync(LOTTIE, 'utf8'));

  // Map friendly layer names (e.g. "typeface.png") to their asset ids.
  const byName = {};
  for (const layer of lottie.layers || []) {
    if (layer.refId) byName[layer.nm] = layer.refId;
  }

  if (!args.length || args[0] === '--list') {
    console.log('Swappable image assets in hero-animation.json:');
    for (const [nm, id] of Object.entries(byName)) {
      console.log(`  ${nm}  (${id})`);
    }
    console.log('\nUsage: node swap-lottie-asset.js <asset-name> <replacement.png>');
    return;
  }

  const [name, imgPath] = args;
  if (!imgPath) {
    console.error('Missing replacement image path. See --list.');
    process.exit(1);
  }

  const abs = resolve(process.cwd(), imgPath);
  const buf = readFileSync(abs);
  const { w, h } = pngDimensions(buf);
  const dataUri = `data:image/png;base64,${buf.toString('base64')}`;

  const id = byName[name] || (name.startsWith('image_') ? name : null);
  if (!id) {
    console.error(`Asset "${name}" not found. Run with --list to see names.`);
    process.exit(1);
  }

  const asset = (lottie.assets || []).find((a) => a.id === id);
  if (!asset) {
    console.error(`Asset id ${id} not found in assets array.`);
    process.exit(1);
  }

  asset.p = dataUri;
  asset.w = w;
  asset.h = h;
  asset.e = 1;

  writeFileSync(LOTTIE, JSON.stringify(lottie));
  console.log(`Replaced "${name}" (${id}) with ${imgPath} (${w}x${h}).`);
  console.log('Run frontend/scripts/sync-plugin.sh to sync into the plugin.');
}

main();
