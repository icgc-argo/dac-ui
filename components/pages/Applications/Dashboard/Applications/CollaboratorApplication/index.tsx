import { css } from '@emotion/core';
import Table from '@icgc-argo/uikit/Table';
import { IndividualInfo } from 'components/pages/Applications/types';
import { createRef } from 'react';
import DashboardCard from '../../Card';
import { UPLOAD_DATE_FORMAT } from '../InProgress/constants';
import { getFormattedDate } from '../InProgress/helpers';

const CollaboratorApplication = ({
  data,
}: {
  data: { appId: string; applicant: Partial<IndividualInfo>; expiresAtUtc: string }[];
}) => {
  const containerRef = createRef<HTMLDivElement>();
  return (
    <DashboardCard
      title="Collaborator Applications"
      subtitle="You have data access from the following applications"
      CustomIcon={() => (
        <img
          src="/icons-collaborator.svg"
          css={css`
            margin-right: 8px;
          `}
          width="30px"
          height="30px"
        />
      )}
    >
      <Table
        data={data}
        columns={[
          {
            accessor: 'appId',
            Header: 'Application #',
          },
          {
            accessor: 'applicant.info.primaryAffiliation',
            Header: 'Institution',
          },
          { accessor: 'applicant.info.displayName', Header: 'Applicant' },
          {
            accessor: 'expiresAtUtc',
            Header: 'Access Expiry',
            Cell: ({ value }: { value: string }) => (
              <span>{getFormattedDate(value, UPLOAD_DATE_FORMAT)}</span>
            ),
          },
        ]}
        parentRef={containerRef}
        showPagination={false}
        withOutsideBorder
        stripped
      />
    </DashboardCard>
  );
};

export default CollaboratorApplication;
