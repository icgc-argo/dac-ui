import { useEffect, useState } from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import { useGetApplications } from 'global/hooks';
import { ApplicationsResponseItem } from 'components/pages/Applications/types';
import { ContentError } from 'components/placeholders';
import Loader from 'components/Loader';

const Applications = () => {
  const [userApplications, setUserApplications] = useState<ApplicationsResponseItem[]>([]);

  const { error, isLoading, response } = useGetApplications();

  useEffect(() => {
    if (response?.data.items) {
      setUserApplications(response.data.items);
    }
  }, [response])

  return isLoading
    ? (
      <div css={css`width: 100%;`}>
        <Loader css={css`
          margin: 24px auto;
        `}
        />
      </div>)
    : error
      ? <ContentError />
      : (
        <div
          css={css`
            flex: 1 0 auto;
          `}
        >
          <div
            css={css`
              display: grid;
              grid-gap: 24px;
              grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
              margin-bottom: 24px;
            `}
          >
            {userApplications.map((application: ApplicationsResponseItem) => (
              <InProgress application={application} key={application.appId} />
            ))}
            <StartApplication />
          </div>
        </div>
      );
};

export default Applications;
