import { css } from '@emotion/core';

import Modal from '@icgc-argo/uikit/Modal';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import Typography from '@icgc-argo/uikit/Typography';
import Textarea from '@icgc-argo/uikit/form/Textarea';

import {
  RequestRevisionsFieldTitles,
  RequestRevisionsFieldNames,
} from './types';

import useRequestRevisionsReducer,
{
  MINIMUM_DETAILS_LENGTH, SECONDARY_FIELDS
} from './useRequestRevisionsReducer';

const ModalSection = ({
  requested,
  details,
  dispatch,
  fieldDisabled,
  fieldName,
  title
}:
  {
    requested: boolean;
    details: string;
    dispatch: any;
    // TODO revisit dispatch type in data hookup ticket
    fieldDisabled: boolean;
    fieldName: string;
    title: string;
  }
) => {
  const theme = useTheme();
  const dispatchArgs = {
    fieldName: fieldName as RequestRevisionsFieldNames
  };

  return (
    <div
      css={css`
        background: ${requested
          ? theme.colors.secondary_4
          : fieldDisabled
            ? theme.colors.grey_2
            : theme.colors.white};
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
        disabled={fieldDisabled}
        onChange={() => dispatch({ type: 'requested', ...dispatchArgs })}
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
        disabled={fieldDisabled || !requested}
        id={`${title}-textarea`}
        css={css`
          height: 69px;
          margin-bottom: 0;
          width: 550px;
        `}
        value={details}
        onChange={(e) => dispatch({ payload: e.target.value, type: 'details', ...dispatchArgs })}
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
  const { state, dispatch } = useRequestRevisionsReducer();
  const { fields, isSecondaryFieldsEnabled, isSendEnabled } = state;

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
        Check off the fields that have issues and provide the revisions details that will be emailed to the applicant.
      </Typography>
      {Object.keys(fields).map((field => {
        const fieldName = field as RequestRevisionsFieldNames;
        return (
          <ModalSection
            requested={fields[fieldName].requested}
            details={fields[fieldName].details}
            dispatch={dispatch}
            key={fieldName}
            fieldDisabled={SECONDARY_FIELDS.includes(fieldName)
              && !isSecondaryFieldsEnabled}
            fieldName={fieldName}
            title={RequestRevisionsFieldTitles[fieldName]}
          />
        )
      }))}
    </Modal>
  );
};

export default RequestRevisionsModal;
