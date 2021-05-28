import Applications from 'components/pages/Applications';
import useAuthContext from 'global/hooks/useAuthContext';
import { createPage } from 'global/utils/pages/createPage';

const ApplicationPage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt, asPath, query } = ctx;
    return { egoJwt, query, asPath };
  },
  isPublic: false,
})(() => {
  const { permissions } = useAuthContext();
  return <Applications />;
});

export default ApplicationPage;
