import { createRef } from 'react';
import { css } from '@emotion/core';
import Modal from '@icgc-argo/uikit/Modal';
import Table from '@icgc-argo/uikit/Table';
import Typography from '@icgc-argo/uikit/Typography';
import { ModalPortal } from 'components/Root';

const testColumns = [
  {
    accessor: 'date',
    Header: 'Day of Status Change',
  },
  {
    accessor: 'appStatus',
    Header: 'Application Status',
  },
  {
    accessor: 'appType',
    Header: 'Application Type',
  },
  {
    accessor: 'actionPerformedBy',
    Header: 'Action Performed By',
  },
];

const testData = [
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }, {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }, {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }, {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }, {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }, {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  },
  {
    actionPerformedBy: 'Submitter',
    appStatus: 'Created',
    appType: 'New',
    date: '2019-09-10',
  },
  {
    actionPerformedBy: 'Submitter 2',
    appStatus: 'Approved',
    appType: 'New',
    date: '2019-01-10',
  }
];

const AppHistoryModal = ({
  appId,
  onClose,
}: {
  appId: string;
  onClose: any;
}) => {
  const containerRef = createRef<HTMLDivElement>();
  return (
    <ModalPortal modalWidth="100%">
      <Modal
        actionVisible={false}
        cancelText="close"
        onCancelClick={onClose}
        onCloseClick={onClose}
        title="Application History"
      >
        <Typography css={css`width: 500px`}>
          The following shows the lifecycle of Application: {appId}.
        </Typography>
        <Table
          /* TODO in API data hook-up ticket
          - real data
          - real accessor names
          - showPagination={false}
          - see ManageApplications table for API/state-driven pagination
          */
          columns={testColumns}
          css={css`
            margin-top: 10px;
          `}
          data={testData}
          defaultSorted={[{ id: 'date', desc: false }]}
          parentRef={containerRef}
          showPagination
          stripped
          withOutsideBorder
        />
      </Modal>
    </ModalPortal>
  )
};

export default AppHistoryModal;