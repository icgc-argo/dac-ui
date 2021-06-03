import ThemeProvider from '@icgc-argo/uikit/ThemeProvider';

export const decorators = [
  (Story) => (
    <ThemeProvider theme="default">
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
