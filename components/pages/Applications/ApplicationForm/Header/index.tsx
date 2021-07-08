import { ReactElement } from 'react';
import { format } from 'date-fns';
import { css } from '@icgc-argo/uikit';
import { isEqual } from 'lodash';

import PageHeader from 'components/PageHeader';

import Actions from './Actions';
import Details from './Details';
import Progress from './Progress';
import { ApplicationState } from '../../types';

const DATE_FORMAT = 'MMM. dd, yyyy';

const ApplicationHeader = ({ data }: { data: any }): ReactElement => {
  const {
    appId,
    createdAtUtc,
    lastUpdatedAtUtc,
    sections: { applicant: { info: { displayName = '', primaryAffiliation = '' } = {} } = {} } = {},
    state,
  } = data;

  const applicant = `${displayName}${primaryAffiliation ? `. ${primaryAffiliation}` : ''}`;

  return (
    <PageHeader>
      <div
        css={css`
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
        `}
      >
        <Details
          appId={appId}
          applicant={applicant}
          createdAt={format(new Date(createdAtUtc), DATE_FORMAT)}
          lastUpdated={format(new Date(lastUpdatedAtUtc), DATE_FORMAT + ' h:mm aaaa')}
        />

        <Progress state={state} />

        {!isEqual(state, ApplicationState.CLOSED) && <Actions appId={appId} state={state} />}
      </div>
    </PageHeader>
  );
};

export default ApplicationHeader;
