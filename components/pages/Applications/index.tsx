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

  const isAdmin = isDacoAdmin(permissions);

  const pageTitle = appId.toUpperCase() || 'Application page';

  // TODO PUT THIS BACK LATER
  return (
    <DefaultPageLayout title={pageTitle}>
      <ManageApplications />
    </DefaultPageLayout>
  );
};

export default Application;
