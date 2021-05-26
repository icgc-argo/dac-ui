import React from 'react';
import { NextPageContext } from 'next';

export type GetInitialPropsContext = NextPageContext & {
  res?: NextPageContext['res'] & {
    redirect?: (s: string) => void;
  };
};

export type ClientSideGetInitialPropsContext = {
  pathname: GetInitialPropsContext['pathname'];
  query: GetInitialPropsContext['query'];
  asPath?: GetInitialPropsContext['asPath'];
};

type GetInitialPropsContextWithEgo = GetInitialPropsContext & {
  egoJwt?: string;
};

export type PageConfigProps = {
  getInitialProps: (args: GetInitialPropsContextWithEgo) => Promise<any>;
  isPublic?: boolean;
};

export type PageWithConfig = PageConfigProps & React.ComponentType<any>;
