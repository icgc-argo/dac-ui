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
  onUpload = () => {},
  onUploadError = () => {},
  validators = [],
}: {
  text: string;
  url: string;
  onUpload?: (data?: any) => void;
  onUploadError?: (err?: any) => void;
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
          onUploadError(err);
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
