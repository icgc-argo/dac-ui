import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import DefaultPageLayout from 'components/DefaultPageLayout';
import ApplicationForm from './ApplicationForm';
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

  const pageTitle = appId.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {appId ? <ApplicationForm appId={appId} /> : <Dashboard />}
    </DefaultPageLayout>
  );
};

export default Application;
