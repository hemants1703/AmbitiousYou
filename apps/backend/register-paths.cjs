'use strict';
const fs = require('fs');
const path = require('path');
const { register } = require('tsconfig-paths');

const projectRoot = path.resolve(__dirname);
const distDir = path.join(projectRoot, 'dist');

// Vercel Nest keeps bare `src/*` requires. NFT does not follow those aliases, so
// vercel.json includeFiles ships dist/** (nest build .js) and src/**.
// Prefer dist/*.js when present (complete nest build); fall back to src/*.js.
const pathMappings = fs.existsSync(distDir)
  ? { 'src/*': ['dist/*', 'src/*'] }
  : { 'src/*': ['src/*'] };

register({
  baseUrl: projectRoot,
  paths: pathMappings,
  addMatchAll: true,
});
