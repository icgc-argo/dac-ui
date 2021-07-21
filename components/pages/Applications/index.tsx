import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import DefaultPageLayout from 'components/DefaultPageLayout';
import Loader from 'components/Loader';
import { useAuthContext } from 'global/hooks';
import { hasDacoScope, isDacoAdmin } from 'global/utils/egoTokenUtils';

const ApplicationForm = dynamic(() => import('./ApplicationForm'), { loading: Loader });
const ManageApplications = dynamic(() => import('./ManageApplications'), { loading: Loader });
const Dashboard = dynamic(() => import('./Dashboard'), { loading: Loader });

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

  const hasDacoAccess = hasDacoScope(permissions);
  const normalisedAppId = appId.toUpperCase();
  const pageTitle = normalisedAppId || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {isLoading ? (
        <Loader />
      ) : appId ? (
        <ApplicationForm appId={normalisedAppId} isAdmin={isAdmin} />
      ) : isAdmin ? (
        <ManageApplications />
      ) : (
        <Dashboard hasDacoAccess={hasDacoAccess} />
      )}
    </DefaultPageLayout>
  );
};

export default Application;
