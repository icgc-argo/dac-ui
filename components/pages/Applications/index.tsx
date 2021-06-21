import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';

import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import { useAuthContext } from 'global/hooks';
import DefaultPageLayout from 'components/DefaultPageLayout';

import ApplicationForm from './ApplicationForm';
import ManageApplications from './ManageApplications';
import Dashboard from './Dashboard';

type QueryType = {
  query: {
    ID?: string[];
  };
};

const Application = (): ReactElement => {
  const {
    query: { ID: [appId = ''] = [] },
  }: QueryType = useRouter();
  const { loadingAuth, permissions } = useAuthContext();

  const isAdmin = isDacoAdmin(permissions);

  const pageTitle = appId.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {loadingAuth ? (
        <DnaLoader />
      ) : appId ? (
        <ApplicationForm appId={appId} isAdmin={isAdmin} />
      ) : isAdmin ? (
        <ManageApplications />
      ) : (
        <Dashboard isAdmin={isAdmin} />
      )}
    </DefaultPageLayout>
  );
};

export default Application;
