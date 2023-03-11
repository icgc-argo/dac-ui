import { createRef, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import Modal from '@icgc-argo/uikit/Modal';
import Table from '@icgc-argo/uikit/Table';
import Typography from '@icgc-argo/uikit/Typography';
import { capitalize, startCase } from 'lodash';
import urlJoin from 'url-join';
import Banner from '@icgc-argo/uikit/notifications/Banner';
import { AxiosResponse, AxiosError } from 'axios';
import { format } from 'date-fns';

import { ModalPortal } from 'components/Root';
import { useAuthContext } from 'global/hooks';
import { API } from 'global/constants';
import { DacoRole, UpdateEvent, UserViewApplicationUpdate } from './types';
import { DATE_RANGE_DISPLAY_FORMAT } from 'global/utils/dates/constants';

const columns = [
  {
    accessor: 'date',
    Header: 'Date of Status Change',
    Cell: ({ original }: { original: UserViewApplicationUpdate }) =>
      format(new Date(original.date), DATE_RANGE_DISPLAY_FORMAT),
  },
  {
    accessor: 'eventType',
    Header: 'Application Status',
    Cell: ({ original }: { original: UserViewApplicationUpdate }) => {
      if (original.eventType === UpdateEvent.SUBMITTED) {
        return 'Submitted for Review';
      } else {
        // dac-api returns these as string enums, so just formatting from uppercase to capitalized for each word, for nicer text display
        return startCase(original.eventType.toLowerCase());
      }
    },
  },
  {
    accessor: 'applicationInfo.appType',
    Header: 'Application Type',
    Cell: ({ original }: { original: UserViewApplicationUpdate }) =>
      capitalize(original.applicationInfo.appType),
  },
  {
    accessor: 'author.role', // non-admin users are shown author role only, not id
    Header: 'Action Performed By',
    Cell: ({ original }: { original: UserViewApplicationUpdate }) =>
      original.author.role === DacoRole.ADMIN
        ? 'DACO Administrator'
        : capitalize(original.author.role),
  },
];

const AppHistoryModal = ({ appId, onClose }: { appId: string; onClose: any }) => {
  const containerRef = createRef<HTMLDivElement>();
  const [historyData, setHistoryData] = useState<UserViewApplicationUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { fetchWithAuth } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      appId,
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then((res: AxiosResponse) => {
        setHistoryData(res.data.updates);
      })
      .catch((err: AxiosError) => {
        console.warn('Error retrieving application history: ', err);
        setLoadingError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ModalPortal modalWidth="100%">
      <Modal
        actionVisible={false}
        cancelText="close"
        onCancelClick={onClose}
        onCloseClick={onClose}
        title="Application History"
      >
        {loadingError && (
          <Banner
            variant="ERROR"
            size="SM"
            title="Something went wrong"
            content="Could not load application history data. Please close the modal and try again."
          />
        )}
        <Typography
          css={css`
            width: 500px;
          `}
        >
          The following shows the lifecycle of Application: {appId}.
        </Typography>
        {!isLoading && (
          <Table
            css={css`
              margin-top: 10px;
            `}
            columns={columns}
            data={historyData}
            sortable={false}
            parentRef={containerRef}
            showPagination={false}
            stripped
            withOutsideBorder
          />
        )}
      </Modal>
    </ModalPortal>
  );
};

export default AppHistoryModal;
