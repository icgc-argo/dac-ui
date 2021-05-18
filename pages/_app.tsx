import { NextPageContext } from 'next';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';

const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  return (
    <Root pageContext={ctx}>
      <Component {...pageProps} />
    </Root>
  );
};

export default App;
