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
    query: { ID: [applicationID] = [] },
  }: QueryType = useRouter();
  

  return (
    <DefaultPageLayout title={'Application page'} >
      {applicationID ? (
        <ApplicationForm ID={applicationID} />
      ) : ( // placeholder for the Dashboard
        <> 
        </>
      )}
    </DefaultPageLayout>
  );
};

export default Application;
