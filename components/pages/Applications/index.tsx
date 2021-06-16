import { ReactElement } from 'react';
import { useRouter } from 'next/router';

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
  const { permissions } = useAuthContext();

  const isAdmin = false; //isDacoAdmin(permissions);

  const pageTitle = appId.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {appId ? (
        <ApplicationForm appId={appId} />
      ) : isAdmin ? (
        <ManageApplications />
      ) : (
        <Dashboard isAdmin={isAdmin} />
      )}
    </DefaultPageLayout>
  );
};

export default Application;
