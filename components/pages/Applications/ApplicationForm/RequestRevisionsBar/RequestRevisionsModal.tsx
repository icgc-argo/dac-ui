import React from 'react';
import { css } from '@emotion/core';

import Modal from '@icgc-argo/uikit/Modal';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import Typography from '@icgc-argo/uikit/Typography';
import Textarea from '@icgc-argo/uikit/form/Textarea';

const ModalSection = ({ active = false, title = "short" }: { active?: boolean; title?: string; }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        background: ${active ? theme.colors.secondary_4 : theme.colors.white};
        border: 1px solid ${theme.colors.grey_2};
        display: flex;
        margin-bottom: 5px;
        padding: 6px;
        justify-content: space-between;
      `}
    >
      <input
        checked={false}
        css={css`
          margin-top: 13px;
        `}
        onChange={() => {
          console.log(`onChange ${title} checkbox`)
        }}
        type="checkbox"
        value={title}
      />
      <Typography
        bold
        css={css`
          flex: 1;
          margin-top: 9px;
          padding: 0 11px 0 8px;
        `}
      >
        {title}
      </Typography>
      <Textarea
        aria-label={`${title} textarea`}
        id={`${title}-textarea`}
        css={css`
          align-self: flex-end;
          height: 69px;
          margin-bottom: 0;
          width: 550px;
        `}
        value={title}
        onChange={() => {
          console.log(`onChange ${title} textarea`);
        }}
        onBlur={() => {
          console.log(`onBlur ${title} textarea`);
        }}
      />
    </div>
  );
};

const RequestRevisionsModal = ({
  dismissModal
}: {
  dismissModal: () => any | void;
}) => {
  const theme = useTheme();

  return (
    <Modal
      title="Request Revisions"
      actionVisible={true}
      actionButtonText="Send Request"
      buttonSize="sm"
      cancelText="Cancel"
      onCancelClick={dismissModal}
      onCloseClick={dismissModal}
    >
      <Typography
        bold
        css={css`
          margin-top: 0;
        `}
      >
        Check off the sections that have issues and provide the revisions details that will be emailed to the applicant.
      </Typography>
      <ModalSection />
    </Modal>
  );
};

export default RequestRevisionsModal;
