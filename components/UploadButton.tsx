import css from '@emotion/css';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { AxiosError } from 'axios';
import { useAuthContext } from 'global/hooks';
import React, { useState } from 'react';
import { CustomLoadingButton } from './pages/Applications/ApplicationForm/Forms/common';

const VALID_FILE_TYPE = ['application/pdf'];
const MAX_FILE_SIZE = 5242880;

export const pdfValidator = (file: { size: number; type: string }) =>
  file.size <= MAX_FILE_SIZE && VALID_FILE_TYPE.includes(file.type);

const UploadButton = ({
  text,
  url,
  onUpload,
  onUploadError,
  validators = [],
}: {
  text: string;
  url: string;
  onUpload?: any;
  onUploadError?: any;
  validators?: any;
}) => {
  const theme = useTheme();
  const fileInputRef = React.createRef<HTMLInputElement>();
  const { fetchWithAuth } = useAuthContext();

  const [uploadError, setUploadError] = useState(false);
  const [isUploadInProgress, setUploadInProgress] = useState(false);

  // make button work as input
  const selectFile = () => {
    const fp = fileInputRef.current;
    if (fp) {
      fp.click();
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];

    if (file && validators.every((v: (file: any) => boolean) => v(file))) {
      setUploadError(false);
      setUploadInProgress(true);
      const formData = new FormData();
      formData.append('file', file);
      fetchWithAuth({
        data: formData,
        method: 'POST',
        url,
      })
        .then(({ data }: { data: any }) => {
          onUpload(data);
        })
        .catch((err: AxiosError) => {
          console.error('File failed to upload.', err);
          setUploadError(true);
          onUploadError();
        })
        .finally(() => {
          setUploadInProgress(false);
        });
    } else {
      console.warn('invalid file');
      setUploadError(true);
      onUploadError();
    }
  };

  return (
    <Button
      disabled={false}
      size="sm"
      onClick={selectFile}
      aria-label="Signed Application"
      css={css`
        ${uploadError &&
        css`
          background-color: ${theme.colors.error};
          border-color: ${theme.colors.error};

          :hover,
          :active,
          :focus {
            background-color: ${theme.colors.error_1};
            border-color: ${theme.colors.error_1};
          }
        `}
      `}
      isLoading={isUploadInProgress}
      Loader={(props: any) => <CustomLoadingButton text={text} {...props} />}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
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
      {text}
    </Button>
  );
};

export default UploadButton;
