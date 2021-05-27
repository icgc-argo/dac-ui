import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import DefaultPageLayout from 'components/DefaultPageLayout';
import ApplicationForm from './ApplicationForm';

type QueryType = {
  query: {
    ID?: string[];
  };
};

const Application = (): ReactElement => {
  const {
    query: { ID: [appID = ''] = [] },
  }: QueryType = useRouter();

  const pageTitle = appID.toUpperCase() || 'Application page';

  return (
    <DefaultPageLayout title={pageTitle}>
      {appID ? (
        <ApplicationForm appId={appID} />
      ) : (
        // placeholder for the Dashboard
        <></>
      )}
    </DefaultPageLayout>
  );
};

export default Application;
