import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import DefaultPageLayout from 'components/DefaultPageLayout';
import Loader from 'components/Loader';
import { useAuthContext } from 'global/hooks';
import { isDacoAdmin } from 'global/utils/egoTokenUtils';

const ApplicationForm = dynamic(() => import('./ApplicationForm'));
const ManageApplications = dynamic(() => import('./ManageApplications'));
const Dashboard = dynamic(() => import('./Dashboard'));

type QueryType = {
  query: {
    ID?: string[];
  };
};

const Application = (): ReactElement => {
  const {
    query: { ID: [appId = ''] = [] },
  }: QueryType = useRouter();
  const { isLoading, permissions } = useAuthContext();

  const isAdmin = permissions.length > 0 && isDacoAdmin(permissions);
  const pageTitle = appId.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {isLoading ? (
        <Loader />
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
