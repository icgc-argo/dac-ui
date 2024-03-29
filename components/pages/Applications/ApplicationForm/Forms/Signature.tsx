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
import Button from '@icgc-argo/uikit/Button';
import Control from '@icgc-argo/uikit/form/FormControl';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React, { ReactElement, useState } from 'react';
import router from 'next/router';
import { styled } from '@icgc-argo/uikit';
import { AxiosError } from 'axios';
import urlJoin from 'url-join';
import Modal from '@icgc-argo/uikit/Modal';
import Link from '@icgc-argo/uikit/Link';

import FormFieldHelpBubble from './FormFieldHelpBubble';
import { RequiredStar } from './RequiredFieldsMessage';
import {
  DOCUMENT_TYPES,
  FormSectionValidationState_Signature,
  FormValidationStateParameters,
} from './types';
import { DateFormat } from 'global/utils/dates/types';
import { getFormattedDate } from 'global/utils/dates/helpers';
import { API, APPLICATIONS_PATH, SUBMISSION_SUCCESS_CHECK } from 'global/constants';
import { useAuthContext } from 'global/hooks';
import { ModalPortal } from 'components/Root';
import { CustomLoadingButton, generatePDFDocument } from './common';
import { ApplicationState } from '../../types';
import { getStaticComponents, UITitle } from '../../PDF/common';

const FormControl = styled(Control)`
  display: flex;
  flex-wrap: nowrap !important;
  figure {
    margin: 0;
  }
`;

const VALID_FILE_TYPE = ['application/pdf'];
const MAX_FILE_SIZE = 5242880;

const Signature = ({
  appId,
  localState,
  refetchAllData,
  primaryAffiliation,
  isSectionDisabled,
  sectionLastUpdatedAt,
}: {
  appId: string;
  localState: FormSectionValidationState_Signature;
  refetchAllData: any;
  primaryAffiliation: string;
  applicationState: ApplicationState;
  isSectionDisabled: boolean;
  sectionLastUpdatedAt: string;
}): ReactElement => {
  const theme = useTheme();
  const { signedAppDocObjId, signedDocName, uploadedAtUtc } = localState;

  const [isModalVisible, setModalVisible] = useState(false);
  const dismissModal = () => setModalVisible(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const { fetchWithAuth } = useAuthContext();
  const [pdfIsLoading, setPdfIsLoading] = useState(false);
  const [isUploadInProgress, setUploadInProgress] = useState(false);

  const fileInputRef = React.createRef<HTMLInputElement>();

  // make button work as input
  const selectFile = () => {
    const fp = fileInputRef.current;
    if (fp) {
      fp.click();
    }
  };

  const submit = () => {
    setIsSubmitting(true);
    fetchWithAuth({
      data: {
        state: 'REVIEW',
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then(() => {
        localStorage.setItem(SUBMISSION_SUCCESS_CHECK, 'true');
        refetchAllData();
        router.push(`${APPLICATIONS_PATH}/${appId}?section=terms`);
      })
      .catch((err: AxiosError) => {
        console.error('Failed to submit.', err);
      })
      .finally(() => {
        setModalVisible(false);
        setIsSubmitting(false);
      });
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];

    if (file && file.size <= MAX_FILE_SIZE && VALID_FILE_TYPE.includes(file.type)) {
      setSubmissionError(false);
      setUploadInProgress(true);
      const formData = new FormData();
      formData.append('file', file);
      fetchWithAuth({
        data: formData,
        method: 'POST',
        url: `${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.SIGNED_APP}/upload`,
      })
        .then(({ data }: { data: FormValidationStateParameters }) => {
          refetchAllData({
            type: 'updating',
            value: data,
          });
        })
        .catch((err: AxiosError) => {
          console.error('File failed to upload.', err);
          setSubmissionError(true);
        })
        .finally(() => {
          setUploadInProgress(false);
        });
    } else {
      console.warn('invalid file');
      setSubmissionError(true);
    }
  };

  const deleteDocument = () => {
    const docId = signedAppDocObjId.value;
    if (!docId) {
      return false;
    }

    fetchWithAuth({
      method: 'DELETE',
      url: `${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.SIGNED_APP}/assetId/${docId}`,
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

  const { SectionTitle } = getStaticComponents(false);

  return (
    <article>
      <UITitle sectionLastUpdatedAt={sectionLastUpdatedAt}>Sign & Submit</UITitle>

      <section
        css={css`
          ol {
            margin: 0;
            padding: 8px 0 40px 17px;
          }

          li {
            line-height: 24px;
            margin: 25px 0;
          }
        `}
      >
        <Typography>
          <p css={css``}>
            The final step involves adding the proper signatures to authorize this application.
            Please do the following:{' '}
          </p>
          <ol>
            <li>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {' '}
                Download the finalized application:{' '}
                <Button
                  size="sm"
                  css={css`
                    display: inline-block;
                    line-height: 12px;
                    margin-left: 6px;
                  `}
                  Loader={CustomLoadingButton}
                  isLoading={pdfIsLoading}
                  onClick={async () => {
                    if (pdfIsLoading) return false;
                    setPdfIsLoading(true);
                    const data = await fetchWithAuth({ url: urlJoin(API.APPLICATIONS, appId) })
                      .then((res: any) => res.data)
                      .catch((err: AxiosError) => {
                        console.error('Application fetch failed, pdf not generated.', err);
                        setPdfIsLoading(true);
                        return null;
                      });
                    // if data fetch fails, do not proceed to pdf generation
                    if (data) {
                      await generatePDFDocument(data);
                      setPdfIsLoading(false);
                    }
                  }}
                >
                  <span
                    css={css`
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                    `}
                  >
                    <Icon
                      css={css`
                        margin-bottom: -2px;
                        margin-right: 4px;
                      `}
                      fill={theme.colors.white}
                      height="12px"
                      name="download"
                    />
                    Finalized pdf
                  </span>
                </Button>
              </div>
            </li>
            <li>
              On the last page of the application pdf you will find a signatures page.{' '}
              <b>
                You must include BOTH the Principal Investigator and the Institutional
                Representative signatures or your application will be declined.
              </b>
              <br />
              <div
                css={css`
                  margin-left: 10px;
                `}
              >
                a) You can print this page, collect the written signatures, scan the signed page and
                add it back to the finalized application pdf. <br />
                b) Or you can add the proper signatures using electronic methods, such as{' '}
                <Link href="https://www.docusign.ca/" target="_blank">
                  DocuSign
                </Link>{' '}
                or{' '}
                <Link href="https://acrobat.adobe.com/us/en/sign.html" target="_blank">
                  AdobeSign.
                </Link>
              </div>
            </li>
            <li>Upload the signed application below.</li>
          </ol>
          <div
            css={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <Typography
              bold
              variant="label"
              css={css`
                margin: 8px 0;
              `}
            >
              <RequiredStar /> Indicates required fields
            </Typography>
          </div>
        </Typography>
      </section>

      <section>
        <SectionTitle>UPLOAD SIGNED APPLICATION</SectionTitle>
        <FormControl required>
          <InputLabel
            htmlFor="signedApplication"
            css={css`
              width: 144px !important;
            `}
          >
            Signed Application:
          </InputLabel>

          {signedDocName.value ? (
            <Typography
              variant="data"
              css={css`
                width: 100%;
              `}
            >
              <div
                css={css`
                  border: 1px solid ${theme.colors.grey_2};
                  padding: 8px;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  background: ${isSectionDisabled && '#f6f6f7'};
                `}
              >
                <Icon
                  name="file"
                  fill={theme.colors.accent2}
                  css={css`
                    margin-right: 6px;
                  `}
                />
                {signedDocName.value}
                {uploadedAtUtc.value && (
                  <>
                    <span
                      css={css`
                        padding: 0 7px;
                      `}
                    >
                      |
                    </span>{' '}
                    Uploaded on:{' '}
                    {getFormattedDate(uploadedAtUtc.value, DateFormat.UPLOAD_DATE_FORMAT)}
                  </>
                )}
                {!isSectionDisabled && (
                  <Icon
                    name="trash"
                    fill={theme.colors.accent2}
                    css={css`
                      margin-left: auto;
                      cursor: pointer;
                    `}
                    onClick={deleteDocument}
                  />
                )}
              </div>
            </Typography>
          ) : (
            <>
              <Button
                disabled={isSectionDisabled}
                size="sm"
                onClick={selectFile}
                aria-label="Signed Application"
                css={css`
                  width: 220px;
                  margin-right: 70px;
                  margin-left: 20px;
                  ${submissionError &&
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
                  `}
                `}
                isLoading={isUploadInProgress}
                Loader={(props: any) => <CustomLoadingButton text="Upload a file" {...props} />}
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
                Upload a file
              </Button>
              <FormFieldHelpBubble text="Allowed file types: pdf. | Max file size: 5MB" />
            </>
          )}
        </FormControl>
        <Typography
          variant="data"
          css={css`
            margin-left: 160px;
            color: ${theme.colors.error_1};
          `}
        >
          {submissionError ? 'Please upload a pdf file that is 5MB or less.' : ''}
        </Typography>

        <Button
          css={css`
            margin-top: 40px;
          `}
          disabled={isSectionDisabled || !signedAppDocObjId.value}
          onClick={() => setModalVisible(true)}
        >
          Submit Application
        </Button>
      </section>
      {isModalVisible && (
        <ModalPortal>
          <Modal
            title="Are you sure you want to submit this application?"
            onCloseClick={dismissModal}
            FooterEl={() => (
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                `}
              >
                <Button
                  size="md"
                  onClick={submit}
                  Loader={(props: any) => <CustomLoadingButton text="Yes, Submit" {...props} />}
                  isLoading={isSubmitting}
                >
                  Yes, Submit
                </Button>

                <Button
                  variant="text"
                  css={css`
                    margin-left: 10px;
                  `}
                  size="md"
                  onClick={dismissModal}
                >
                  Cancel
                </Button>
              </div>
            )}
          >
            <div
              css={css`
                max-width: 600px !important;
              `}
            >
              Are you sure you want to submit{' '}
              <b>
                Application: {appId} ({primaryAffiliation})?
              </b>{' '}
              If so, the application will be locked for editing and the ICGC DACO will be notified
              to begin the review process.
            </div>
          </Modal>
        </ModalPortal>
      )}
    </article>
  );
};

export default Signature;
