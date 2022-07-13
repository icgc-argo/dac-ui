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

import { createRef, ReactElement, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import { AxiosError } from 'axios';
import { format } from 'date-fns';

import { UikitTheme } from '@icgc-argo/uikit/index';
import Button from '@icgc-argo/uikit/Button';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Modal from '@icgc-argo/uikit/Modal';
import { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';

import { API, DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';
import { useDataContext } from 'global/hooks';
import { ModalPortal } from 'components/Root';

import DoubleFieldRow from '../DoubleFieldRow';
import FormFieldHelpBubble from '../FormFieldHelpBubble';
import {
  FormSectionValidationState_EthicsLetter,
  FormValidationAction,
  FormValidationStateParameters,
  DOCUMENT_TYPES,
} from '../types';
import pluralize from 'pluralize';
import { CustomLoadingButton } from '../common';
import Banner from '@icgc-argo/uikit/notifications/Banner';
import { useToaster } from 'global/hooks/useToaster';
import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';

const VALID_FILE_TYPE = [
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5242880;

enum ModalStates {
  CONFIRMATION = 'confirmation',
  DUPLICATE = 'duplicate',
  CONFIRMATION_DUPLICATE = 'confirmation_duplicate',
  NONE = 'none',
}

// ethics letters are in an object on initial load.
// after the user uploads a new letter it becomes an array.
const getEthicsLetters = (value: any) =>
  Array.isArray(value)
    ? value
    : typeof value === 'undefined'
    ? [] // handle undefined approvalLetterDocs just in case
    : Object.values(value);

const UploadsTable = ({
  appId,
  isSectionDisabled,
  localState,
  refetchAllData,
  required,
  isRequiredPostApproval,
  isApplicationApproved,
}: {
  appId: string;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_EthicsLetter;
  refetchAllData: (action?: Partial<FormValidationAction>) => void;
  required: boolean;
  isRequiredPostApproval: boolean;
  isApplicationApproved: boolean;
}): ReactElement => {
  const containerRef = createRef<HTMLDivElement>();
  const fileInputRef = createRef<HTMLInputElement>();
  const { fetchWithAuth } = useDataContext();
  const theme: UikitTheme = useTheme();

  const [ethicsLetters, setEthicsLetters] = useState<any[]>(
    getEthicsLetters(localState.approvalLetterDocs?.value),
  );
  const [letterCount, setLetterCount] = useState(ethicsLetters.length);
  const [letterError, setLetterError] = useState(false); // !!localState.approvalLetterDocs?.error

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [modalVisibility, setModalVisibility] = useState(ModalStates.NONE);

  const [isFileUploadInProgress, setFileUploadInProgress] = useState(false);

  const toaster = useToaster();

  // make button work as input
  const selectFile = () => {
    const fp = fileInputRef.current;
    if (fp) {
      fp.click();
    }
  };

  const submitFile = (file?: File) => {
    setFileUploadInProgress(true);
    setLetterError(false);
    const formData = new FormData();
    const fileToUpload = file || selectedFile;
    formData.append('file', fileToUpload as File);

    fetchWithAuth({
      data: formData,
      method: 'POST',
      url: `${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.ETHICS}/upload`,
    })
      .then(({ data }: { data: FormValidationStateParameters }) => {
        refetchAllData({
          type: 'updating',
          value: data,
        });
        if (isApplicationApproved) {
          toaster.addToast({
            variant: TOAST_VARIANTS.SUCCESS,
            title: 'New Ethics Letter has been Uploaded',
            content: 'The ICGC DACO has been notified for review.',
            interactionType: 'CLOSE',
          });
        }
      })
      .catch((err: AxiosError) => {
        console.error('File failed to upload.', err);
        setLetterError(true);
      })
      .finally(() => {
        setSelectedFile(undefined);
        setFileUploadInProgress(false);
      });
  };

  const handleFileDelete = (fileId: string) => (event: any) => {
    fetchWithAuth({
      method: 'DELETE',
      url: `${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.ETHICS}/assetId/${fileId}`,
    })
      .then(({ data }: { data: FormValidationStateParameters }) =>
        refetchAllData({
          type: 'updating',
          value: data,
        }),
      )
      .catch((err: AxiosError) => {
        console.error('File could not be deleted.', err);
      });
  };

  const checkForDuplicate = (filename: string) =>
    localState.approvalLetterDocs.value.some(
      (approvalLetter: { name: string; objectId: string; uploadedAtUtc: string }) =>
        approvalLetter.name === filename,
    );

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];
    const isDuplicate = checkForDuplicate(file.name);
    const isValidFile = file && file.size <= MAX_FILE_SIZE && VALID_FILE_TYPE.includes(file.type);

    if (isValidFile) {
      setSelectedFile(file);

      if (isRequiredPostApproval && isDuplicate) {
        setModalVisibility(ModalStates.CONFIRMATION_DUPLICATE);
      } else if (isRequiredPostApproval) {
        setModalVisibility(ModalStates.CONFIRMATION);
      } else if (isDuplicate) {
        setModalVisibility(ModalStates.DUPLICATE);
      } else {
        // state doesn't update fast enough so pass file as an argument
        submitFile(file);
      }
    } else {
      console.warn('invalid file', file);
      setLetterError(true);
    }
  };

  const dismissModal = () => {
    setSelectedFile(undefined);
    setModalVisibility(ModalStates.NONE);
  };

  useEffect(() => {
    const newEthicsLetters = getEthicsLetters(localState.approvalLetterDocs?.value);
    setEthicsLetters(newEthicsLetters);
    const newLetterCount = newEthicsLetters.length;

    letterCount === newLetterCount || setLetterCount(newLetterCount);
    setLetterError(letterCount > 0 && newLetterCount === 0);
  }, [localState.approvalLetterDocs?.value]);

  return (
    <>
      <DoubleFieldRow>
        <FormControl className="vertical" required={required}>
          <InputLabel htmlFor="approvalLetterDocs">
            Please attach an ethics approval letter to this application:
          </InputLabel>
        </FormControl>

        <FormFieldHelpBubble
          css={css`
            margin: 0 !important;
          `}
          tail="left"
          text="Allowed file types: pdf, doc, docx. | Max file size: 5MB"
        />
      </DoubleFieldRow>

      <Typography
        css={css`
          margin: 15px 0 17px !important;
        `}
      >
        If the ethics approval is written in a language other than English,{' '}
        <Typography as="span" bold>
          please upload a translated version
        </Typography>
        .
      </Typography>

      <div
        css={css`
          ${letterCount > 0
            ? css`
                margin-bottom: 30px;
              `
            : css`
                border-bottom: 1px solid ${letterError ? theme.colors.error : theme.colors.grey_2};
              `};
          border-top: 1px solid ${letterError ? theme.colors.error : theme.colors.grey_2};
          padding-top: 10px;
        `}
      >
        <div
          css={css`
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          `}
        >
          <Typography color={theme.colors.grey} variant="data">
            {pluralize('Ethics Letter', letterCount, true)}
          </Typography>

          <div
            css={css`
              align-items: center;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            `}
          >
            {letterError && (
              <Typography
                css={css`
                  color: ${theme.colors.error};
                  font-size: 11px;
                `}
              >
                Please upload a pdf, doc or docx file that is 5MB or less.
              </Typography>
            )}

            <Button
              css={
                letterError &&
                css`
                  background-color: ${theme.colors.error};
                  border-color: ${theme.colors.error};
                  margin-left: 15px;

                  :hover,
                  :active,
                  :focus {
                    background-color: ${theme.colors.error_1};
                    border-color: ${theme.colors.error_1};
                  }
                `
              }
              disabled={isSectionDisabled}
              size="sm"
              onClick={selectFile}
              aria-label="upload an Ethics letter"
              isLoading={isFileUploadInProgress}
              Loader={(props: any) => <CustomLoadingButton text="Upload a file" {...props} />}
            >
              <input
                id="approvalLetterDocs"
                ref={fileInputRef}
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileUpload}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                css={css`
                  display: none;
                `}
              />
              <Icon
                name="upload"
                height="12px"
                width="12px"
                fill="white"
                css={css`
                  margin-right: 3px;
                  margin-bottom: -2px;
                  margin-right: 4px;
                `}
              />
              Upload a file
            </Button>
          </div>
        </div>

        {letterCount > 0 ? (
          <Table
            columns={[
              {
                accessor: 'name',
                Header: 'File Name',
              },
              {
                accessor: 'uploadedAtUtc',
                Cell: ({ value }: { value: string }) =>
                  format(new Date(value), DATE_RANGE_DISPLAY_FORMAT),
                Header: 'Uploaded On',
              },
              ...(isRequiredPostApproval
                ? []
                : [
                    {
                      accessor: 'objectId',
                      Cell: ({ value }: { value: string }) => (
                        <Button
                          css={css`
                            label: action_delete;
                            height: 30px;
                            margin: 0 auto;
                            width: 30px;
                          `}
                          disabled={isSectionDisabled}
                          onClick={handleFileDelete(value)}
                          size="sm"
                          variant="text"
                        >
                          <Icon
                            css={css`
                              margin-bottom: -3px;
                            `}
                            fill={isSectionDisabled ? 'grey_1' : 'accent2'}
                            name="trash"
                          />
                        </Button>
                      ),
                      Header: 'Actions',
                      width: 60,
                    },
                  ]),
            ]}
            css={css`
              margin-top: 10px;
            `}
            data={ethicsLetters}
            defaultSorted={[{ id: 'uploadedAtUtc', desc: true }]}
            parentRef={containerRef}
            showPagination={false}
            stripped
            withOutsideBorder
          />
        ) : (
          <ContentPlaceholder
            title="You have not added any Ethics Letters."
            subtitle="To get started, click the “Upload a File” button above."
            css={css`
              padding: 15px 0 26px;

              p {
                font-size: 12px;
                margin: 6px 0 0 0 !important;

                &:first-of-type {
                  margin-top: 15px !important;
                }
              }
            `}
          >
            <Icon fill={theme.colors.grey_1} name="file" height="30px" width="30px" />
          </ContentPlaceholder>
        )}
      </div>
      {modalVisibility !== ModalStates.NONE && (
        <ModalPortal>
          <Modal
            title="Are you sure you want to upload?"
            onActionClick={() => {
              submitFile();
              dismissModal();
            }}
            onCancelClick={dismissModal}
            onCloseClick={dismissModal}
            actionButtonText="Yes, upload"
          >
            <div
              css={css`
                max-width: 580px;
              `}
            >
              {[ModalStates.CONFIRMATION_DUPLICATE, ModalStates.DUPLICATE].includes(
                modalVisibility,
              ) && (
                <Banner
                  variant={BANNER_VARIANTS.WARNING}
                  content={
                    <div>
                      There is already a file uploaded named {selectedFile?.name}. Uploading this
                      new file will replace the old file with the same name.
                    </div>
                  }
                />
              )}

              {[ModalStates.CONFIRMATION, ModalStates.CONFIRMATION_DUPLICATE].includes(
                modalVisibility,
              ) && (
                <Typography>
                  Are you sure you want to upload <strong>{selectedFile?.name}</strong> to this
                  application? If so, the ICGC DACO will be notified to review the new ethics letter
                  and they will contact you if there are any concerns.
                </Typography>
              )}
            </div>
          </Modal>
        </ModalPortal>
      )}
    </>
  );
};

export default UploadsTable;
