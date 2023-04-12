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

import { ReactElement, useState } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import urlJoin from 'url-join';
import { useAuthContext } from 'global/hooks';
import { API, APPLICATIONS_PATH, APPROVED_APP_CLOSED_CHECK, RENEWAL_PATH } from 'global/constants';
import { AxiosError } from 'axios';
import { ApplicationState, ApprovedDoc } from '../../types';
import { CustomLoadingButton, generatePDFDocument } from '../Forms/common';
import { ModalPortal } from 'components/Root';
import Modal from '@icgc-argo/uikit/Modal';
import router from 'next/router';
import { RefetchDataFunction } from '../Forms/types';
import Banner from '@icgc-argo/uikit/notifications/Banner';
import { createDownloadInWindow } from 'global/utils/helpers';
import { RenewButton } from '../../Dashboard/Applications/InProgress/ButtonGroup';

enum VisibleModalOption {
  NONE = 'NONE',
  CLOSE_APPLICATION = 'CLOSE APPLICATION',
}

const getPdfButtonText: (
  state: ApplicationState,
  approvedAtUtc: string,
  approvedAppDocObjId: string,
) => string = (state, approvedAtUtc, approvedAppDocObjId) => {
  const text = 'PDF';

  if (!!approvedAppDocObjId) {
    return `APPROVED ${text}`;
  }

  if (state === ApplicationState.CLOSED && !!approvedAtUtc) {
    return `SIGNED ${text}`;
  }

  if (
    [
      ApplicationState.DRAFT,
      ApplicationState.REVISIONS_REQUESTED,
      ApplicationState.CLOSED,
    ].includes(state)
  ) {
    return `DRAFT ${text}`;
  }

  if (state === ApplicationState.SIGN_AND_SUBMIT) {
    return `FINALIZED ${text}`;
  }

  if (
    [
      ApplicationState.REVIEW,
      ApplicationState.APPROVED,
      ApplicationState.REJECTED,
      ApplicationState.EXPIRED,
      ApplicationState.PAUSED,
    ].includes(state)
  ) {
    return `SIGNED ${text}`;
  }
  console.warn('Illegal app state! State: ', state);
  return text;
};

const PDF_BUTTON_WIDTH = 130;

const HeaderActions = ({
  appId,
  primaryAffiliation = '',
  state,
  refetchAllData,
  approvedAtUtc,
  currentApprovedDoc,
  ableToRenew,
}: {
  appId: string;
  primaryAffiliation: string;
  state: ApplicationState;
  refetchAllData: RefetchDataFunction;
  approvedAtUtc: string;
  currentApprovedDoc: ApprovedDoc | undefined;
  ableToRenew: boolean;
}): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { fetchWithAuth } = useAuthContext();
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<VisibleModalOption>(VisibleModalOption.NONE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdfButtonText = getPdfButtonText(
    state,
    approvedAtUtc,
    currentApprovedDoc ? currentApprovedDoc.approvedAppDocObjId : '',
  );

  const closeApplicationVisible = [
    ApplicationState.DRAFT,
    ApplicationState.SIGN_AND_SUBMIT,
    ApplicationState.REVISIONS_REQUESTED,
    ApplicationState.APPROVED,
    ApplicationState.PAUSED,
  ].includes(state);

  const isClosedPreApproval = state === ApplicationState.CLOSED && !approvedAtUtc;

  const dismissModal = () => setVisibleModal(VisibleModalOption.NONE);

  const showAccessLossWarning = [ApplicationState.APPROVED, ApplicationState.PAUSED].includes(
    state,
  );

  const submit = () => {
    setIsSubmitting(true);
    fetchWithAuth({
      data: {
        state: ApplicationState.CLOSED,
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then(() => {
        refetchAllData();
        router.push(`${APPLICATIONS_PATH}/${appId}?section=terms`);
      })
      .catch((err: AxiosError) => {
        console.error('Failed to submit.', err);
      })
      .finally(() => {
        dismissModal();
        setIsSubmitting(false);
        if (approvedAtUtc) {
          localStorage.setItem(APPROVED_APP_CLOSED_CHECK, 'true');
        }
      });
  };

  return (
    <>
      {visibleModal === VisibleModalOption.CLOSE_APPLICATION && (
        <ModalPortal>
          <Modal
            actionButtonText="Yes, close"
            title="Are you sure you want to close this application?"
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
                  Loader={(props: any) => <CustomLoadingButton text="Yes, Close" {...props} />}
                  isLoading={isSubmitting}
                >
                  Yes, Close
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
            {showAccessLossWarning && (
              <Banner
                content={
                  <>
                    <b>WARNING:</b> This application is approved, and closing it means that the
                    Applicant and all Collaborators associated with this research project{' '}
                    <b>will lose access to ICGC Controlled Data.</b>
                  </>
                }
                variant="WARNING"
              />
            )}
            <p>
              Are you sure you want to close{' '}
              <b>
                Application: {appId} ({primaryAffiliation})?
              </b>
            </p>
            <p>
              <b>This action cannot be undone and you will be unable to reopen this application.</b>
            </p>
          </Modal>
        </ModalPortal>
      )}
      <section
        css={css`
          display: flex;
          justify-content: flex-end;
          *:not(:last-of-type) {
            margin-right: 5px;
          }
          min-width: 300px;
        `}
      >
        {ableToRenew && (
          <RenewButton appId={appId} link={urlJoin(API.APPLICATIONS, appId, RENEWAL_PATH)}>
            Renew
          </RenewButton>
        )}
        {closeApplicationVisible && (
          <Button
            onClick={() => setVisibleModal(VisibleModalOption.CLOSE_APPLICATION)}
            size="sm"
            variant="secondary"
          >
            Close Application
          </Button>
        )}
        {!isClosedPreApproval && (
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
              const isDownloadZip = [
                ApplicationState.REVIEW,
                ApplicationState.APPROVED,
                ApplicationState.REJECTED,
                ApplicationState.CLOSED,
                ApplicationState.EXPIRED,
              ].includes(state);
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
                    const blob = new Blob([res.data]);
                    const filename = res.headers['content-disposition'].split('"')[1];
                    createDownloadInWindow(filename, blob);
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
        )}
      </section>
    </>
  );
};

export default HeaderActions;
