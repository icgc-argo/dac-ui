import Root from 'components/Root';

const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  return (
    <Root pageContext={{}}>
      <Component {...pageProps} />
    </Root>
  );
};

export default App;
