'use strict';
const fs = require('fs');
const path = require('path');
const { register, createMatchPath } = require('tsconfig-paths');

const projectRoot = path.resolve(__dirname);
const distDir = path.join(projectRoot, 'dist');
const srcDir = path.join(projectRoot, 'src');

// Vercel Nest transpiles src/ and keeps `src/*` aliases (no Nest tsconfig-paths hook).
// nest build already emits relative requires under dist/ — prefer that when present.
const pathMappings = fs.existsSync(distDir)
  ? { 'src/*': ['dist/*', 'src/*'] }
  : { 'src/*': ['src/*'] };

register({
  baseUrl: projectRoot,
  paths: pathMappings,
  addMatchAll: true,
});

// #region agent log
try {
  const probeId = 'src/ambitions/ambition-progress.util';
  const matchPath = createMatchPath(projectRoot, pathMappings, undefined, true);
  const matched = matchPath(probeId);
  const candidates = {
    distUtil: path.join(distDir, 'ambitions', 'ambition-progress.util.js'),
    srcUtilJs: path.join(srcDir, 'ambitions', 'ambition-progress.util.js'),
    srcUtilTs: path.join(srcDir, 'ambitions', 'ambition-progress.util.ts'),
  };
  const payload = JSON.stringify({
    sessionId: '0cea4e',
    runId: 'post-fix-dist-map',
    hypothesisId: 'F',
    location: 'register-paths.cjs',
    message: 'register-paths alias map + file probe',
    data: {
      cwd: process.cwd(),
      projectRoot,
      pathMappings,
      distExists: fs.existsSync(distDir),
      matched,
      exists: {
        distUtil: fs.existsSync(candidates.distUtil),
        srcUtilJs: fs.existsSync(candidates.srcUtilJs),
        srcUtilTs: fs.existsSync(candidates.srcUtilTs),
      },
    },
    timestamp: Date.now(),
  });
  fetch('http://127.0.0.1:7444/ingest/95ba62c0-0758-468b-a2e9-1c03441b6e71', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '0cea4e',
    },
    body: payload,
  }).catch(() => {});
  console.log(payload);
} catch (_) {
  /* ignore */
}
// #endregion
