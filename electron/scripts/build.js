/* eslint-disable no-console */

const { readFileSync, rmSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const run = require('@zhrk/pack/utils/run');

const cwd = process.cwd();
const buildPath = path.join(cwd, 'build');
const distPath = path.join(cwd, 'dist');
const indexHtmlPath = path.join(buildPath, 'index.html');

const build = () => {
  const args = process.argv.slice(2)[0];
  let version;

  console.log('Building app...');
  rmSync(distPath, { recursive: true, force: true });
  run('zhrk-scripts', ['build:rsbuild']);

  const content = readFileSync(indexHtmlPath, 'utf8');

  writeFileSync(indexHtmlPath, content.replaceAll('="/', '="./'));

  if (args && args.includes('version')) version = args.split('version=')[1];

  console.log('Building electron app...');

  run(`electron-builder${version ? ` --config.extraMetadata.version=${version}` : ''}`);

  rmSync(buildPath, { recursive: true, force: true });
};

build();
