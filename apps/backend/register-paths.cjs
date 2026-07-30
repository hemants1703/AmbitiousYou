'use strict';
const path = require('path');
const { register } = require('tsconfig-paths');

const projectRoot = path.resolve(__dirname);
register({
  baseUrl: projectRoot,
  paths: { 'src/*': ['src/*'] },
});

// #region agent log
try {
  const payload = JSON.stringify({
    sessionId: '0cea4e',
    runId: 'post-fix',
    hypothesisId: 'A',
    location: 'register-paths.cjs',
    message: 'register-paths loaded via module-relative import',
    data: {
      cwd: process.cwd(),
      dirname: __dirname,
      projectRoot,
      registerPathsMatchedCwd: path.resolve(process.cwd()) === projectRoot,
    },
    timestamp: Date.now(),
  });
  // Local debug ingest (no-op on Vercel); also stdout for Vercel function logs.
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
