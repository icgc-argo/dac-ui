import ThemeProvider from '@icgc-argo/uikit/ThemeProvider';
import Head from 'components/Head';
import React from 'react';

const Root = ({
  children,
  pageContext,
}: {
  children: any;
  pageContext: any;
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
      <ThemeProvider>{children}</ThemeProvider>
    </React.Fragment>
  );
};

export default Root;
