import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';
import { getConfig } from 'global/config';
import urlJoin from 'url-join';
import queryString from 'query-string';
import { get } from 'lodash';


const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  // once JWT has been checked it'll be a string.
  const [initialJwt, setInitialJwt] = useState<string | undefined>(undefined);

  useEffect(() => {
    // only handle getting/removing token here.
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    if (isValidJwt(egoJwt)) {
      console.log('APP: valid JWT');
      setInitialJwt(egoJwt);
    } else {
      console.log('APP: invalid JWT');
      setInitialJwt('');
      localStorage.removeItem(EGO_JWT_KEY);
    }
  });


  // PARSE
  // const parsed = queryString.parseUrl(decodeURIComponent(props.ctx.query.redirect));
  // return get(parsed.query, 'isOauth') === 'true';

  useEffect(() => {
    // handle redirects after JWT is checked.
    // setting the default as undefined prevents
    // this hook from running before JWT is checked.


    // console.log(redirect_uri, egoLoginUrl.href)

    // const parsed = queryString.parseUrl(decodeURIComponent(egoUrl));
    // const query = get(parsed.query, 'redirect');

    // console.log({ parsed, query })

    // ATTEMPT 2: TRY WITH QUERY STRING


    if (typeof initialJwt !== 'undefined') {
      console.log('APP: JWT updated');
      // if (!initialJwt) {
      //   Router.push(egoUrl)
      // }
      const decoded = decodeURIComponent(ctx.asPath || '');
      Router.push(decoded)
      if (!initialJwt && !Component.isPublic) {
        console.log('APP: private page, no auth')
        // TODO: redirect to /?loggingOut=true&redirect=URL
      }
    }
  }, [initialJwt]);

  // if (!initialJwt) {
  //   return <p>boop!</p>
  // } else {
  //   return <p>beep!</p>
  // }

  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      {initialJwt || Component.isPublic
        ? <Component {...pageProps} />
        : <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'cyan' }}><DnaLoader /></div>}
    </Root>
  );
};

App.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
  const pageProps = await Component.getInitialProps({ ...ctx });
  return {
    ctx: {
      pathname: ctx.pathname,
      query: ctx.query,
      asPath: ctx.asPath,
    },
    pageProps,
  };
};

export default App;
