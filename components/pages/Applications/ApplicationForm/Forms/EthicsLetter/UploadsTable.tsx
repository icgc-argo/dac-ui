import { createRef, ReactElement, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import { AxiosError } from 'axios';
import { format } from 'date-fns';

import { UikitTheme } from '@icgc-argo/uikit/index';
import Button from '@icgc-argo/uikit/Button';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import { API, DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import DoubleFieldRow from '../DoubleFieldRow';
import FormFieldHelpBubble from '../FormFieldHelpBubble';
import NoFilesMessage from './NoFilesMessage';
import {
  FormSectionValidationState_EthicsLetter,
  FormValidationAction,
  FormValidationStateParameters,
  UPLOAD_TYPES,
} from '../types';

const VALID_FILE_TYPE = [
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5242880;

const UploadsTable = ({
  appId,
  isSectionDisabled,
  localState,
  refetchAllData,
  required,
}: {
  appId: string;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_EthicsLetter;
  refetchAllData: (action: Partial<FormValidationAction>) => void;
  required: boolean;
}): ReactElement => {
  const containerRef = createRef<HTMLDivElement>();
  const fileInputRef = createRef<HTMLInputElement>();
  const { fetchWithAuth } = useAuthContext();
  const theme: UikitTheme = useTheme();

  const [letterCount, setLetterCount] = useState(localState.approvalLetterDocs?.value.length || 0);
  const [letterError, setLetterError] = useState(false); // !!localState.approvalLetterDocs?.error

  // make button work as input
  const selectFile = () => {
    const fp = fileInputRef.current;
    if (fp) {
      fp.click();
    }
  };

  const handleFileDelete = (fileId: string) => (event: any) => {
    fetchWithAuth({
      method: 'DELETE',
      url: `${API.APPLICATIONS}/${appId}/assets/${UPLOAD_TYPES.ETHICS}/assetId/${fileId}`,
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

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];

    if (file && file.size <= MAX_FILE_SIZE && VALID_FILE_TYPE.includes(file.type)) {
      const formData = new FormData();
      formData.append('file', file);

      fetchWithAuth({
        data: formData,
        method: 'POST',
        url: `${API.APPLICATIONS}/${appId}/assets/${UPLOAD_TYPES.ETHICS}/upload`,
      })
        .then(({ data }: { data: FormValidationStateParameters }) =>
          refetchAllData({
            type: 'updating',
            value: data,
          }),
        )
        .catch((err: AxiosError) => {
          console.error('File failed to upload.', err);
        });
    } else {
      console.warn('invalid file', file);
    }
  };

  useEffect(() => {
    const newLetterCount = localState.approvalLetterDocs?.value.length;

    letterCount === newLetterCount || setLetterCount(newLetterCount);
    setLetterError(letterCount > 0 && newLetterCount === 0);
  }, [localState]);

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
          please upload a version translated to English
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
            {`${letterCount} Ethics Letter${letterCount === 0 || letterCount > 0 ? 's' : ''}`}
          </Typography>

          <div
            css={css`
              align-items: center;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            `}
          >
            {!!letterError && (
              <Typography
                css={css`
                  color: ${theme.colors.error};
                  font-size: 11px;
                `}
              >
                Please upload an ethics letter.
              </Typography>
            )}

            <Button
              css={
                letterError &&
                css`
                  background-color: ${theme.colors.error};
                  border-color: ${theme.colors.error};
                  margin-left: 15px;

                  :hover {
                    background-color: ${theme.colors.error_1};
                    border-color: ${theme.colors.error_1};
                  }
                `
              }
              disabled={isSectionDisabled}
              size="sm"
              onClick={selectFile}
              aria-label="upload an Ethics letter"
            >
              <input
                id="approvalLetterDocs"
                ref={fileInputRef}
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileUpload}
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
            ]}
            css={css`
              margin-top: 10px;
            `}
            data={localState.approvalLetterDocs?.value}
            defaultSorted={[{ id: 'uploadedAtUtc', desc: true }]}
            parentRef={containerRef}
            showPagination={false}
            stripped
            withOutsideBorder
          />
        ) : (
          <NoFilesMessage fileType="Ethics Letters" />
        )}
      </div>
    </>
  );
};

export default UploadsTable;
