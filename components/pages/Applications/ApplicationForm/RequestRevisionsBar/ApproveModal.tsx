import { useState } from 'react';
import { AxiosError } from 'axios';
import urlJoin from 'url-join';
import { add, format } from 'date-fns';
import { css } from '@emotion/core';
import router from 'next/router';

import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';

import { useAuthContext } from 'global/hooks';
import { API, DATE_FORMAT } from 'global/constants';

const ApproveModal = ({
  appId,
  dismissModal,
  primaryAffiliation,
  refetch,
}: {
  appId: string;
  dismissModal: () => any | void;
  primaryAffiliation: string;
  refetch: ({ }) => any | void;
}) => {
  const startDate = format(new Date(), DATE_FORMAT);
  const endDate = format(add(new Date(startDate), { years: 1 }), DATE_FORMAT);

  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchWithAuth } = useAuthContext();

  const submitApproval = () => {
    setIsLoading(true);
    fetchWithAuth({
      data: {
        state: 'APPROVED'
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId)
    })
      .then(() => {
        router.reload();
      })
      .catch((err: AxiosError) => {
        setIsLoading(false);
        setError(err);
      });
  };

  return (
    <Modal
      actionButtonText={isLoading ? 'Loading' : 'Approve for Access'}
      actionDisabled={isLoading}
      buttonSize="sm"
      cancelText="Cancel"
      onActionClick={() => submitApproval()}
      onCancelClick={dismissModal}
      onCloseClick={dismissModal}
      title="Are you sure you want to APPROVE the application?"
    >
      <Typography>
        Are you sure you want to approve <strong>Application: {appId} ({primaryAffiliation})?</strong>
      </Typography>
      <Typography>
        If so, the applicant and collaborators will be notified and will receive access to ICGC Controlled Data for the following time period:
      </Typography>
      <Typography>
        <strong>Start Date:</strong> {startDate} &nbsp; | &nbsp; <strong>End Date:</strong> {endDate}
      </Typography>
      <FormControl error={!!error}>
        <FormHelperText
          css={css`
            margin-left: 0;
          `}
          onErrorOnly
        >
          Something went wrong. Please try again.
        </FormHelperText>
      </FormControl>
    </Modal>
  );
};

export default ApproveModal;
