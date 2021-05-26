import { PageConfigProps, PageWithConfig } from './types';

type CreatePageConfigs = {
  getInitialProps?: PageConfigProps['getInitialProps'];
  isPublic?: boolean;
};

export const createPage = <P extends {} = any>({
  getInitialProps,
  isPublic = false,
}: CreatePageConfigs) => (
  page: React.ComponentType<P> & CreatePageConfigs = () => <div>Here's a page</div>,
): PageWithConfig => {
  page.getInitialProps = getInitialProps || (async () => []);
  page.isPublic = isPublic;
  return page as PageWithConfig;
};
