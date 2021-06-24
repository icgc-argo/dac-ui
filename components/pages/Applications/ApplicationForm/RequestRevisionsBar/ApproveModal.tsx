import { useState } from 'react';

import { add, format } from 'date-fns';

import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';

import { useApplicationsAPI } from 'global/hooks';
import { useEffect } from 'react';

const DATE_FORMAT = 'MMM. dd, yyyy';

const ApproveModal = ({
  appId,
  dismissModal,
  primaryAffiliation,
}: {
  appId: string;
  dismissModal: () => any | void;
  primaryAffiliation: string;
}) => {
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const startDate = format(new Date(), DATE_FORMAT);
  const endDate = format(add(new Date(startDate), { years: 1 }), DATE_FORMAT);


  return (
    <Modal
      actionButtonText="Approve for Access"
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
    </Modal>
  );
};

export default ApproveModal;
