import { css } from '@emotion/core';

import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Modal from '@icgc-argo/uikit/Modal';
import Textarea from '@icgc-argo/uikit/form/Textarea';
import Typography from '@icgc-argo/uikit/Typography';
import useTheme from '@icgc-argo/uikit/utils/useTheme';

import {
  RequestRevisionsFieldTitles,
  RequestRevisionsFieldNames,
} from './types';

import useRequestRevisionsReducer, { SECONDARY_FIELDS } from './useRequestRevisionsReducer';

const textareaStyle = css`
/* copied UIKIT textarea styles because textarea wasn't programatically updating.
the value got "stuck" in an emotion component prop inside the textarea. */
  background: #fff;
  border: 1px solid #babcc2;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: Work Sans, sans-serif;
  font-size: 14px;
  height: 69px;
  line-height: 1.57;
  margin-bottom: 0;
  padding: 8px 10px;
  resize: vertical;
  width: 550px;
  &:focus:not(.disabled):not(.error) {
    box-shadow: 0 0 4px 0 #4596de;
    outline: 0;
  }
  &:hover:not(.disabled):not(.error) {
    border-color: #4596de !important;
  }
  &.disabled:not(.disabled):not(.error) {
    background-color: #f6f6f7;
  }
  &.error {
    border-color: #df1b42 !important;
  }
`;

const ModalSection = ({
  requested,
  details,
  dispatch,
  error,
  fieldDisabled,
  fieldName,
  title
}:
  {
    requested: boolean;
    details: string;
    dispatch: any;
    // TODO revisit dispatch type in data hookup ticket
    error: string;
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
            ? theme.colors.grey_3
            : theme.colors.white};
        border: 1px solid ${theme.colors.grey_2};
        display: flex;
        margin-bottom: 5px;
        padding: 6px 6px 0;
        justify-content: space-between;
      `}
    >
      <input
        checked={requested}
        css={css`
          margin-top: 13px;
        `}
        disabled={fieldDisabled}
        id={`${title}-checkbox`}
        onChange={() => dispatch({ type: 'requestedClick', ...dispatchArgs })}
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
        <label htmlFor={`${title}-${requested ? 'checkbox' : 'textarea'}`}>{title}</label>
      </Typography>
      <FormControl
        css={css`
          margin-bottom: 0;
        `}
        disabled={fieldDisabled}
        error={error}
      >
        <textarea
          aria-label={`${title} textarea`}
          id={`${title}-textarea`}
          className={`${error ? 'error' : ''} ${fieldDisabled ? 'disabled' : ''}`}
          css={textareaStyle}
          onBlur={(e) => dispatch({ payload: e.target.value, type: 'detailsBlur', ...dispatchArgs })}
          onChange={(e) => dispatch({ payload: e.target.value, type: 'detailsChange', ...dispatchArgs })}
          onClick={() => dispatch({ type: 'detailsClick', ...dispatchArgs })}
          readOnly={fieldDisabled} // making the field disabled will block click events
          value={details}
        />
        <FormHelperText
          css={css`
            margin-bottom: 7px;
          `}
          onErrorOnly
        >
          {error}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

const RequestRevisionsModal = ({
  dismissModal
}: {
  // TODO improve in data hookup ticket
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
            error={fields[fieldName].error}
            fieldDisabled={SECONDARY_FIELDS.includes(fieldName)
              && !isSecondaryFieldsEnabled}
            fieldName={fieldName}
            key={fieldName}
            title={RequestRevisionsFieldTitles[fieldName]}
          />
        )
      }))}
    </Modal>
  );
};

export default RequestRevisionsModal;
