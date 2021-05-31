import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import useAuthContext from 'global/hooks/useAuthContext';
import DefaultPageLayout from 'components/DefaultPageLayout';

import ApplicationForm from './ApplicationForm';
import ManageApplications from './ManageApplications';

type QueryType = {
  query: {
    ID?: string[];
  };
};


const Application = (): ReactElement => {
  const {
    query: { ID: [applicationID] = [] },
  }: QueryType = useRouter();
  const { permissions } = useAuthContext();

  const isAdmin = isDacoAdmin(permissions);

  return (
    <DefaultPageLayout title={'Application page'}>
      {applicationID ? (
        <ApplicationForm ID={applicationID} />
      ) : isAdmin
        ? (
          <ManageApplications />
        ) : (
          <p>Placeholder for user dashboard</p>
        )}
    </DefaultPageLayout>
  );
};

export default Application;
