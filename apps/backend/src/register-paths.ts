import { join } from 'node:path';
import { loadConfig, register } from 'tsconfig-paths';

// Load `paths` from tsconfig relative to apps/backend — not process.cwd(), which
// differs between Docker, local dev, and Vercel serverless invocations.
const projectRoot = join(__dirname, '..');
const config = loadConfig(projectRoot);

if (config.resultType === 'success') {
  register({
    baseUrl: config.absoluteBaseUrl,
    paths: config.paths,
  });
} else {
  console.warn(
    'tsconfig-paths: could not load path aliases from tsconfig.json:',
    config.message,
  );
}
