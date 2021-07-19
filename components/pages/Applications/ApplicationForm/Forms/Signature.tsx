import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Control from '@icgc-argo/uikit/form/FormControl';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React, { ReactElement, useState } from 'react';
import FormFieldHelpBubble from './FormFieldHelpBubble';
import { RequiredStar } from './RequiredFieldsMessage';
import { styled } from '@icgc-argo/uikit';
import { AxiosError } from 'axios';
import { UPLOAD_TYPES } from './types';
import { UPLOAD_DATE_FORMAT } from '../../Dashboard/Applications/InProgress/constants';
import { getFormattedDate } from '../../Dashboard/Applications/InProgress/helpers';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';
import Modal from '@icgc-argo/uikit/Modal';
import { ModalPortal } from 'components/Root';
import Link from '@icgc-argo/uikit/Link';
import { CustomLoadingButton, generatePDFDocument } from './common';
import urlJoin from 'url-join';

const FormControl = styled(Control)`
  display: flex;
  flex-wrap: nowrap !important;
  figure {
    margin: 0;
  }
`;

const VALID_FILE_TYPE = ['application/pdf'];
const MAX_FILE_SIZE = 5242880;

const Signature = ({ appId }: { appId: string }): ReactElement => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] =
    useState<{ name: string; uploadDate: string } | undefined>(undefined);

  const [isModalVisible, setModalVisible] = useState(false);
  const dismissModal = () => setModalVisible(false);

  const { fetchWithAuth } = useAuthContext();
  const [pdfIsLoading, setPdfIsLoading] = useState(false);

  const fileInputRef = React.createRef<HTMLInputElement>();

  // make button work as input
  const selectFile = () => {
    const fp = fileInputRef.current;
    if (fp) {
      fp.click();
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];

    if (file && file.size <= MAX_FILE_SIZE && VALID_FILE_TYPE.includes(file.type)) {
      const formData = new FormData();
      formData.append('file', file);

      fetchWithAuth({
        data: formData,
        method: 'POST',
        url: `${API.APPLICATIONS}/${appId}/assets/${UPLOAD_TYPES.SIGNED_APP}/upload`,
      })
        .then(() => {
          const fileDetails = {
            name: file.name,
            uploadDate: getFormattedDate(Date.now(), UPLOAD_DATE_FORMAT),
          };
          setSelectedFile(fileDetails);
        })
        .catch((err: AxiosError) => {
          console.error('File failed to upload.', err);
        });
    } else {
      console.warn('invalid file');
    }
  };

  return (
    <article>
      <Typography bold component="h2">
        Sign & Submit
      </Typography>
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
                        false;
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
        <Typography
          bold
          component="h3"
          css={css`
            color: #0774d3;
          `}
        >
          UPLOAD SIGNED APPLICATION
        </Typography>
        <FormControl required>
          <InputLabel
            htmlFor="signedApplication"
            css={css`
              width: 144px !important;
            `}
          >
            Signed Application:
          </InputLabel>

          {selectedFile ? (
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
                `}
              >
                <Icon
                  name="file"
                  fill={theme.colors.accent2}
                  css={css`
                    margin-right: 6px;
                  `}
                />
                {`${selectedFile.name} | Uploaded on: ${selectedFile.uploadDate}`}
                <Icon
                  name="trash"
                  fill={theme.colors.accent2}
                  css={css`
                    margin-left: auto;
                  `}
                />
              </div>
            </Typography>
          ) : (
            <>
              <Button
                size="sm"
                onClick={selectFile}
                aria-label="Signed Application"
                css={css`
                  width: 220px;
                  margin-right: 70px;
                  margin-left: 20px;
                `}
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

        <Button
          css={css`
            margin-top: 40px;
          `}
          disabled={!selectedFile}
          onClick={() => setModalVisible(true)}
        >
          Submit Application
        </Button>
      </section>
      {isModalVisible && (
        <ModalPortal>
          <Modal
            title="Are you sure you want to submit this application?"
            onCancelClick={dismissModal}
            onCloseClick={dismissModal}
            actionButtonText="Yes, Submit"
          >
            <div
              css={css`
                max-width: 600px !important;
              `}
            >
              Are you sure you want to submit{' '}
              <b>Application: DACO-12344 (Ontario Institute for Cancer Research)?</b> If so, the
              application will be locked for editing and the ICGC DACO will be notified to begin the
              review process.
            </div>
          </Modal>
        </ModalPortal>
      )}
    </article>
  );
};

export default Signature;
