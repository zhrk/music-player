const config = require('@zhrk/pack/eslint.config.js');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    extends: [config],
  },
]);
