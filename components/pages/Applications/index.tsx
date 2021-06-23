import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';
import dynamic from 'next/dynamic';

import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import { useAuthContext } from 'global/hooks';
import DefaultPageLayout from 'components/DefaultPageLayout';

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
