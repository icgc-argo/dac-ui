import { useEffect } from 'react';
import Router from 'next/router';

import Loader from 'components/Loader';

import { APPLICATIONS_PATH } from 'global/constants';
import { createPage } from 'global/utils/pages/createPage';
import { fetchEgoToken, } from 'global/utils/authUtils';

const LoginLoaderPage = createPage({
  isPublic: true,
})(() => {
  useEffect(() => {
    Router.prefetch(APPLICATIONS_PATH);
    fetchEgoToken();
  }, []);

  return (
    <Loader />
  );
});

export default LoginLoaderPage;
