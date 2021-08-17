import Applications from 'components/pages/Applications';
import { createPage } from 'global/utils/pages/createPage';

const ApplicationPage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt, asPath, query } = ctx;
    return { egoJwt, query, asPath };
  },
  isPublic: false,
})(() => {
  return <Applications />;
});

export default ApplicationPage;
