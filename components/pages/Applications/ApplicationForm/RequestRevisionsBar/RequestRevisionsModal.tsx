/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { css } from '@emotion/core';
import { useState } from 'react';

import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import useTheme from '@icgc-argo/uikit/utils/useTheme';

import {
  RequestRevisionsFieldTitles,
  RequestRevisionsFieldNames,
  RequestRevisionProperties,
} from './types';

import useRequestRevisionsReducer, { SECONDARY_FIELDS } from './useRequestRevisionsReducer';
import { AxiosError } from 'axios';
import { useAuthContext } from 'global/hooks';
import urlJoin from 'url-join';
import router from 'next/router';
import { API } from 'global/constants';

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
  details,
  dispatch,
  error,
  focus,
  fieldDisabled,
  fieldName,
  title,
}: {
  details: string;
  dispatch: any;
  // TODO revisit dispatch type in data hookup ticket
  error: string;
  focus: boolean;
  fieldDisabled: boolean;
  fieldName: string;
  title: string;
}) => {
  const theme = useTheme();
  const dispatchArgs = {
    fieldName: fieldName as RequestRevisionsFieldNames,
  };

  return (
    <div
      css={css`
        background: ${focus
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
      <Typography
        bold
        css={css`
          flex: 1;
          margin-top: 9px;
          padding: 0 11px 0 8px;
        `}
      >
        <label htmlFor={`${title}-textarea`}>{title}</label>
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
          onBlur={() => dispatch({ type: 'detailsBlur', ...dispatchArgs })}
          onChange={(e) =>
            dispatch({ payload: e.target.value, type: 'detailsChange', ...dispatchArgs })
          }
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
  appId,
  dismissModal,
}: {
  appId: string;
  dismissModal: () => any | void;
}) => {
  const { state, dispatch } = useRequestRevisionsReducer();
  const { fields, isSecondaryFieldsEnabled, isSendEnabled } = state;
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchWithAuth } = useAuthContext();

  const submitRequestRevisions = () => {
    setIsLoading(true);
    fetchWithAuth({
      data: {
        revisionRequest: Object.entries(fields).reduce(
          (acc, curr: [string, RequestRevisionProperties]) => ({
            ...acc,
            [curr[0]]: {
              details: curr[1].details,
              requested: curr[1].requested,
            },
          }),
          {},
        ),
        state: 'REVISIONS REQUESTED',
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId),
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
      actionButtonText={isLoading ? 'Loading' : 'Send Request'}
      actionDisabled={isLoading || !isSendEnabled}
      buttonSize="sm"
      cancelText="Cancel"
      onActionClick={() => submitRequestRevisions()}
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
        Please provide the revision details for the sections that have issues. These details will be
        emailed to the applicant.
      </Typography>

      {Object.keys(fields).map((field) => {
        const fieldName = field as RequestRevisionsFieldNames;
        return (
          <ModalSection
            details={fields[fieldName].details}
            dispatch={dispatch}
            error={fields[fieldName].error}
            focus={fields[fieldName].focus}
            fieldDisabled={SECONDARY_FIELDS.includes(fieldName) && !isSecondaryFieldsEnabled}
            fieldName={fieldName}
            key={fieldName}
            title={RequestRevisionsFieldTitles[fieldName]}
          />
        );
      })}

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

export default RequestRevisionsModal;
