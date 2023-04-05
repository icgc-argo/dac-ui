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

import { ReactElement } from 'react';
import { format } from 'date-fns';
import styled from '@emotion/styled-base';
import { css } from '@icgc-argo/uikit';
import { UikitTheme } from '@icgc-argo/uikit/index';
import PageHeader from 'components/PageHeader';
import { DateFormat } from 'global/utils/dates/types';
import Actions from './Actions';
import Details from './Details';
import Progress from './Progress';
import { RefetchDataFunction } from '../Forms/types';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ApplicationData } from '../../types';
import { isPastExpiry } from '../Forms/helpers';
import { getFormattedDate } from 'global/utils/dates/helpers';

export type ApplicationAccessInfo = { date?: string; isWarning: boolean; status: string };

// only pass accessInfo for applications that have been approved
// add 'status' key to allow easy string changes
const getAccessInfo = (data: ApplicationData) => {
  const {
    state,
    lastPausedAtUtc,
    attestationByUtc,
    expiresAtUtc,
    isAttestable,
    approvedAtUtc,
    closedAtUtc,
    ableToRenew,
    expiredEventDateUtc,
    renewalAppId,
  } = data;
  const appPastExpiry = isPastExpiry(expiresAtUtc);
  switch (true) {
    case state === ApplicationState.PAUSED:
      return {
        date:
          // otherwise display calculated attestationBy date, the assumption is the app is paused due to missing attestation
          lastPausedAtUtc || attestationByUtc,
        isWarning: true,
        status: '! Paused',
      };
    case state === ApplicationState.EXPIRED:
      return {
        date: expiredEventDateUtc || expiresAtUtc,
        isWarning: true,
        status: 'Expired',
      };
    case isAttestable:
      return {
        date: attestationByUtc,
        isWarning: true,
        status: '! Pausing',
      };
    // for remaining scenarios where the app has been approved.
    case !!approvedAtUtc:
      return {
        date: closedAtUtc || expiresAtUtc,
        /**
         * ```
         * isWarning true if:
         * - closedAtUtc is present OR
         * - ableToRenew is true -> this indicates the application expiry is approaching soon
         * ```
         */
        isWarning: !!closedAtUtc || ableToRenew || (!appPastExpiry && !!renewalAppId),
        /**```
         * Status:
         * - "Expiring" -> app has not yet expired but is within the renewal period
         * - "Expired" -> app has been closed after approval
         * - "Expires" -> app is still approved and app has not reached the renewal period
         * ```
         */
        status:
          ableToRenew || (!appPastExpiry && !!renewalAppId)
            ? '! Expiring'
            : closedAtUtc
            ? 'Expired'
            : 'Expires',
      };
    default:
      return undefined;
  }
};

const HeaderLabel = styled('div')`
  ${({ theme }: { theme: UikitTheme }) => css`
    ${theme.typography.data};
    background: ${theme.colors.primary_1};
    border-radius: 8px;
    color: ${theme.colors.white};
    font-weight: bold;
    margin: 0 auto 10px 72px;
    padding: 3px 8px;
    text-align: center;
    width: 130px;
  `}
`;

const ApplicationHeader = ({
  data,
  refetchAllData,
}: {
  data: ApplicationData;
  refetchAllData: RefetchDataFunction;
}): ReactElement => {
  const {
    appId,
    createdAtUtc,
    lastUpdatedAtUtc,
    revisionsRequested,
    approvedAtUtc,
    sections: { applicant: { info: { displayName = '', primaryAffiliation = '' } = {} } = {} } = {},
    state,
    approvedAppDocs,
    isAttestable,
    ableToRenew,
    isRenewal,
    expiresAtUtc,
  } = data;

  const applicant = `${displayName}${primaryAffiliation ? `. ${primaryAffiliation}` : ''}`;
  const currentApprovedDoc = approvedAppDocs.find((doc) => doc.isCurrent);

  const showRevisionsRequestedFlag =
    revisionsRequested &&
    [ApplicationState.REVISIONS_REQUESTED, ApplicationState.SIGN_AND_SUBMIT].includes(state);

  const accessInfo = getAccessInfo(data);

  return (
    <PageHeader>
      <div
        css={css`
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
        `}
      >
        <Details
          appId={appId}
          applicant={applicant}
          createdAt={getFormattedDate(createdAtUtc, DateFormat.DATE_TEXT_FORMAT)}
          // using format() here because DATE_TEXT_FORMAT + ' h:mm aaaa' was not added as a DateFormat enum, may be removed/replaced by TIME_AND_DATE_FORMAT
          lastUpdated={format(
            new Date(lastUpdatedAtUtc),
            DateFormat.DATE_TEXT_FORMAT + ' h:mm aaaa',
          )}
          accessInfo={accessInfo}
        />

        <div>
          <div>
            {showRevisionsRequestedFlag ? (
              <HeaderLabel>Revisions Requested</HeaderLabel>
            ) : isAttestable ? (
              <HeaderLabel>Attestation Required</HeaderLabel>
            ) : isRenewal ? (
              <HeaderLabel>Renewal Application</HeaderLabel>
            ) : null}
          </div>

          <Progress state={state} expiryDate={expiresAtUtc} />
        </div>

        <Actions
          appId={appId}
          primaryAffiliation={primaryAffiliation}
          state={state}
          refetchAllData={refetchAllData}
          approvedAtUtc={approvedAtUtc}
          currentApprovedDoc={currentApprovedDoc}
          ableToRenew={ableToRenew}
        />
      </div>
    </PageHeader>
  );
};

export default ApplicationHeader;
