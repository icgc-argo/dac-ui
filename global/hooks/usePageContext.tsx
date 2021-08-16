import { createContext, useContext } from 'react';
import { ClientSideGetInitialPropsContext } from 'global/utils/pages/types';

export const PageContext = createContext<ClientSideGetInitialPropsContext>({
  pathname: '',
  query: {},
  asPath: '',
});

export default function usePageContext(): ClientSideGetInitialPropsContext {
  const pageContext = useContext(PageContext);
  return pageContext;
}

export const usePageQuery = <T extends { [k: string]: string }>() => {
  const { query } = usePageContext();
  return query as T;
};
