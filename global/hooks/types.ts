import * as React from 'react';
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
  isPublic: boolean;
  isAccessible: (args: {
    egoJwt?: string;
    ctx: GetInitialPropsContext;
    initialPermissions?: string[];
  }) => Promise<boolean>;
  getInitialProps: (args: GetInitialPropsContextWithEgo) => Promise<any>;
  getGqlQueriesToPrefetch: (
    args: GetInitialPropsContextWithEgo,
  ) => Promise<
    Array<{
      query: string; // The gql query string
      variables?: { [key: string]: any };
    }>
  >;
  startWithGlobalLoader: boolean;
};
export type PageWithConfig = PageConfigProps & React.ComponentType<any>;
