import React from 'react';
import ThemeProvider from '@icgc-argo/uikit/ThemeProvider';

import Head from 'components/Head';
import { AuthProvider } from 'global/hooks/useAuthContext';

const Root = ({
  children,
  pageContext,
  egoJwt,
}: {
  children: any;
  pageContext: any;
  egoJwt?: string;
}) => {
  return (
    <React.Fragment>
      <style>
        {`
        body {
          margin: 0;
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
        } /* custom! */
        #__next {
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
        }
      `}
      </style>
      <Head />
      <AuthProvider egoJwt={egoJwt}>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </React.Fragment>
  );
};

export default Root;
