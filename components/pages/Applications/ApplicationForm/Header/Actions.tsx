import React, { ReactElement, useState } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import urlJoin from 'url-join';
import { isEqual } from 'lodash';
import { useAuthContext } from 'global/hooks';
import { API } from 'global/constants';
import { AxiosError } from 'axios';
import { ApplicationState } from '../../types';
import { CustomLoadingButton, generatePDFDocument } from '../Forms/common';

// EXPIRED and RENEWING handling is tbd, CLOSED excludes Action buttons
const getPdfButtonText: (state: ApplicationState) => string = (state) => {
  const text = 'PDF';

  if ([ApplicationState.DRAFT, ApplicationState.REVISIONS_REQUESTED].includes(state)) {
    return `DRAFT ${text}`;
  }
  if (isEqual(state, ApplicationState.SIGN_AND_SUBMIT)) {
    return `FINALIZED ${text}`;
  }
  if (
    [ApplicationState.REVIEW, ApplicationState.APPROVED, ApplicationState.REJECTED].includes(state)
  ) {
    return `SIGNED ${text}`;
  }
  console.warn('Illegal app state! State: ', state);
  return text;
};

const PDF_BUTTON_WIDTH = 130;

const HeaderActions = ({
  appId,
  state,
}: {
  appId: string;
  state: ApplicationState;
}): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { fetchWithAuth } = useAuthContext();
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);

  const pdfButtonText = getPdfButtonText(state);

  return (
    <section
      css={css`
        display: flex;

        *:not(:last-of-type) {
          margin-right: 5px;
        }
      `}
    >
      <Button onClick={function noRefCheck() {}} size="sm" variant="secondary">
        Close Application
      </Button>
      <Button
        // setting width on button & CustomLoadingButton to prevent resize on loading state
        css={css`
          width: ${PDF_BUTTON_WIDTH}px;
        `}
        isAsync
        Loader={(props: any) => <CustomLoadingButton text={pdfButtonText} {...props} />}
        variant="secondary"
        isLoading={pdfIsLoading}
        onClick={async () => {
          setPdfIsLoading(true);
          const isDownloadZip = [ApplicationState.REVIEW, ApplicationState.APPROVED].includes(
            state,
          );
          const downloadUrl = urlJoin(
            API.APPLICATIONS,
            appId,
            isDownloadZip ? API.APP_PACKAGE : '',
          );
          const data = await fetchWithAuth({
            url: downloadUrl,
            ...(isDownloadZip ? { responseType: 'blob' } : {}),
          })
            .then((res: any) => {
              if (res.data && isDownloadZip) {
                const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
                const filename = res.headers['content-disposition'].split('"')[1];
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setPdfIsLoading(false);
                return {};
              } else {
                return res.data;
              }
            })
            .catch((err: AxiosError) => {
              console.error('Application fetch failed, pdf or zip not generated.', err);
              setPdfIsLoading(false);
              return null;
            });
          // if data fetch fails, do not proceed to pdf generation
          if (data && !isDownloadZip) {
            // reset loading state after generate is done
            generatePDFDocument(data, setPdfIsLoading);
          }
        }}
      >
        <Icon
          css={css`
            margin-bottom: -2px;
          `}
          fill={theme.colors.accent2_dark}
          height="12px"
          width="12px"
          name="download"
        />{' '}
        {pdfButtonText}
      </Button>
    </section>
  );
};

export default HeaderActions;
