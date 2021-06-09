import Applications from 'components/pages/Applications';
import { useAuthContext } from 'global/hooks';
import { createPage } from 'global/utils/pages/createPage';

const ApplicationPage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt, asPath, query } = ctx;
    return { egoJwt, query, asPath };
  },
  isPublic: true,
})(() => {
  const { permissions } = useAuthContext();
  return <Applications />;
});

export default ApplicationPage;
