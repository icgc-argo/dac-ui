import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import useAuthContext from 'global/hooks/useAuthContext';
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

  // OFFLINE CHANGE
  // const isAdmin = isDacoAdmin(permissions);
  const isAdmin = true;

  const pageTitle = appId.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      <ApplicationForm appId={appId} isAdmin={isAdmin} />
    </DefaultPageLayout>
  );

  // OFFLINE CHANGE
  // return (
  //   <DefaultPageLayout title={pageTitle}>
  //     {appId
  //       ? <ApplicationForm appId={appId} isAdmin={isAdmin} />
  //       : isAdmin
  //         ? <ManageApplications />
  //         : <Dashboard />
  //     }
  //   </DefaultPageLayout>
  // );
};

export default Application;
