const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withTranspileModules = require('next-transpile-modules')([
  '@icgc-argo/uikit',
]);

module.exports = withPlugins([withTranspileModules, [withImages]], {
  publicRuntimeConfig: {},
});
