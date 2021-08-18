const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withTranspileModules = require('next-transpile-modules')(['@icgc-argo/uikit']);

const USE_DAC_API_PROXY = process.env.USE_DAC_API_PROXY === 'true';

module.exports = withPlugins([withTranspileModules, [withImages], [withFonts]], {
  inlineImageLimit: 10240,
  publicRuntimeConfig: {
    NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
    NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
    NEXT_PUBLIC_EGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_EGO_PUBLIC_KEY,
    NEXT_PUBLIC_DAC_API_ROOT: USE_DAC_API_PROXY ? '/api/' : process.env.NEXT_PUBLIC_DAC_API_ROOT,
    NEXT_PUBLIC_ARGO_ROOT: process.env.NEXT_PUBLIC_ARGO_ROOT,
    NEXT_PUBLIC_ARGO_DOCS_ROOT: process.env.NEXT_PUBLIC_ARGO_DOCS_ROOT,
    NEXT_PUBLIC_ARGO_PLATFORM_ROOT: process.env.NEXT_PUBLIC_ARGO_PLATFORM_ROOT,
    NEXT_PUBLIC_MAINTENANCE_MODE_ON: process.env.NEXT_PUBLIC_MAINTENANCE_MODE_ON,
  },
  ...(USE_DAC_API_PROXY
    ? {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: `${process.env.NEXT_PUBLIC_DAC_API_ROOT}/:path*`, // Proxy to Backend
            },
          ];
        },
      }
    : {}),
});
