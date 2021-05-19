import Home from 'components/pages/Home';
import { createPage } from 'global/utils/pages/createPage';

const HomePage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt } = ctx;
    return { egoJwt };
  },
  isPublic: true,
})(() => {
  return <Home />;
});

export default HomePage;
