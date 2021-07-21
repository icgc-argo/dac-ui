import { ReactElement } from 'react';
import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import { ModalPortal } from 'components/Root';
import { useRouter } from 'next/router';

import { EGO_LOGIN_URL } from 'global/constants';

const ApplyForAccessModal = ({
  dismissModal,
}: {
  dismissModal: () => any | void;
}): ReactElement => {
  const router = useRouter();

  return (
    <ModalPortal>
      <Modal
        title="Apply for Access"
        onActionClick={() => router.push(EGO_LOGIN_URL)}
        onCancelClick={dismissModal}
        onCloseClick={dismissModal}
        actionButtonText="Login with Google"
        actionButtonId="modal-action-btn_google-logo"
      >
        <Typography>
          For authorization, we require a valid Google email address (Gmail or GSuite). This will be the email address you will use to log in
          to ICGC DACO, ICGC ARGO, and ICGC 25K and will be the email address associated with ICGC Controlled Data Access.
        </Typography>
      </Modal>
    </ModalPortal>
  );
};

export default ApplyForAccessModal;
