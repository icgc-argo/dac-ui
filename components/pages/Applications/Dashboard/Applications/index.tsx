import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import { ApplicationsField, ApplicationsResponseItem } from 'components/pages/Applications/types';
import { isEmpty } from 'lodash';
import { useGetApplications } from 'global/hooks';
import ContentError from 'components/placeholders/ContentError';
import Loader from 'components/Loader';

const Applications = () => {
  const { error, isLoading, response } = useGetApplications({
    sort: [{ field: ApplicationsField.lastUpdatedAtUtc, order: 'desc' }],
  });
  const applications = response?.data?.items || [];

  return isLoading ? (
    <Loader
      css={css`
        margin: 24px auto;
      `}
    />
  ) : error ? (
    <ContentError />
  ) : (
    <div
      css={css`
        display: grid;
        grid-gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        margin-bottom: 24px;
      `}
    >
      {!isEmpty(applications) &&
        applications.map((application: ApplicationsResponseItem) => (
          <InProgress application={application} key={application.appId} />
        ))}
      <StartApplication />
    </div>
  );
};

export default Applications;
