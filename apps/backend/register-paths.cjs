'use strict';
const path = require('path');
const { register } = require('tsconfig-paths');

const projectRoot = path.resolve(__dirname);
register({
  baseUrl: projectRoot,
  paths: { 'src/*': ['src/*'] },
});
