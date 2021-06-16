import React, { useState } from 'react';
import { css } from '@emotion/core';
import { find } from 'lodash';

import Modal from '@icgc-argo/uikit/Modal';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import Typography from '@icgc-argo/uikit/Typography';
import Textarea from '@icgc-argo/uikit/form/Textarea';

import {
  RequestRevisionsSectionTitles,
  RequestRevisionsSectionState,
  RequestRevisionsSectionKeys,
} from './types';

const MINIMUM_DETAILS_LENGTH = 10;
const SECONDARY_SECTIONS: RequestRevisionsSectionKeys[] = ['general'];

const ModalSection = ({
  requested,
  details,
  handleRequest,
  sectionDisabled,
  sectionKey,
  title
}:
  {
    requested: boolean;
    details: string;
    handleRequest: (string: RequestRevisionsSectionKeys) => void;
    sectionDisabled: boolean;
    sectionKey: string;
    title: string;
  }
) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        background: ${requested ? theme.colors.secondary_4 : theme.colors.white};
        border: 1px solid ${theme.colors.grey_2};
        display: flex;
        margin-bottom: 5px;
        padding: 6px;
        justify-content: space-between;
      `}
    >
      <input
        checked={requested}
        css={css`
          margin-top: 13px;
        `}
        disabled={sectionDisabled}
        onChange={() => handleRequest(sectionKey as RequestRevisionsSectionKeys)}
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
        {title} {sectionDisabled ? 'disabled' : 'enabled'}
      </Typography>
      <Textarea
        aria-label={`${title} textarea`}
        disabled={sectionDisabled || !requested}
        id={`${title}-textarea`}
        css={css`
          align-self: flex-end;
          height: 69px;
          margin-bottom: 0;
          width: 550px;
        `}
        value={details}
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

const defaultState = Object.keys(RequestRevisionsSectionTitles).reduce((acc, curr) => ({
  ...acc,
  [curr]: {
    details: '',
    requested: false,
  }
}), {}) as RequestRevisionsSectionState;

const useRequestRevisionsModalState = () => {
  const [modalState, setModalState] = useState<RequestRevisionsSectionState>(defaultState);

  // handle checkboxes
  // handle textboxes

  const handleRequest = (sectionKey: RequestRevisionsSectionKeys) => {
    setModalState({
      ...modalState,
      [sectionKey]: {
        ...modalState[sectionKey as RequestRevisionsSectionKeys],
        requested: !modalState[sectionKey as RequestRevisionsSectionKeys].requested,
      }
    })
  }

  return {
    handleRequest,
    modalState
  }
}

const RequestRevisionsModal = ({
  dismissModal
}: {
  dismissModal: () => any | void;
}) => {
  const theme = useTheme();
  const {
    handleRequest,
    modalState
  } = useRequestRevisionsModalState();

  const modalStatePrimarySections = Object.keys(RequestRevisionsSectionTitles)
    .filter(title => SECONDARY_SECTIONS.includes(title as RequestRevisionsSectionKeys))
    .reduce((acc, curr) => ({
      ...acc,
      [curr]: { ...modalState[curr as RequestRevisionsSectionKeys] },
    }), {}) as RequestRevisionsSectionState;

  // enable secondary sections when at least one primary section
  // is checked off and has enough characters in its details field
  const isSecondarySectionsEnabled = !!find(
    Object.values(modalStatePrimarySections),
    item => item.requested && item.details && item.details.length >= MINIMUM_DETAILS_LENGTH
  );

  // enable send if at least one section is checked off and has enough characters in its details field
  // AND no sections are checked off with insufficient characters
  const isSendEnabled = !!find(
    Object.values(modalState), item => item.requested &&
      item.details &&
      item.details.length >= MINIMUM_DETAILS_LENGTH
  ) &&
    !find(
      Object.values(modalState), item => item.requested &&
        (!item.details || item.details.length < MINIMUM_DETAILS_LENGTH)
    );

  return (
    <Modal
      actionButtonText="Send Request"
      actionDisabled={!isSendEnabled}
      buttonSize="sm"
      cancelText="Cancel"
      onCancelClick={dismissModal}
      onCloseClick={dismissModal}
      title="Request Revisions"
    >
      <Typography
        bold
        css={css`
          margin-top: 0;
        `}
      >
        Check off the sections that have issues and provide the revisions details that will be emailed to the applicant.
      </Typography>
      {Object.keys(modalState).map((sectionKey) => (
        <ModalSection
          requested={modalState[sectionKey as RequestRevisionsSectionKeys].requested}
          details={modalState[sectionKey as RequestRevisionsSectionKeys].details}
          handleRequest={handleRequest}
          key={sectionKey}
          sectionDisabled={SECONDARY_SECTIONS.includes(sectionKey as RequestRevisionsSectionKeys) && !isSecondarySectionsEnabled}
          sectionKey={sectionKey}
          title={RequestRevisionsSectionTitles[sectionKey as RequestRevisionsSectionKeys]}
        />
      ))}
    </Modal>
  );
};

export default RequestRevisionsModal;
