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
      {/*
      // Commented out for soft launch. User flow is not implemented yet.
      // Please do not delete. Will be used for hard launch.
      <Button onClick={function noRefCheck() {}} size="sm" variant="secondary">
        Close Application
      </Button>*/}
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
            await generatePDFDocument(data);
            setPdfIsLoading(false);
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
