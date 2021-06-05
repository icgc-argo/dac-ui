module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/core'
        }
      }
    ],
  ],
  plugins: [
    [
      '@emotion',
      {
        autoLabel: 'always',
        labelFormat: '-E11-[local]',
      },
    ],
    [
      'emotion',
      {
        autoLabel: true,
        labelFormat: '-E10-[local]',
      },
    ],
  ],
};
