const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withTranspileModules = require('next-transpile-modules')(['@icgc-argo/uikit']);

module.exports = withPlugins([withTranspileModules, [withImages]], {
  publicRuntimeConfig: {
    NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
    NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
    NEXT_PUBLIC_EGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_EGO_PUBLIC_KEY,
  },
});
