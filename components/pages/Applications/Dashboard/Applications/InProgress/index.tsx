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

import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import DashboardCard from '../../Card';
import ProgressBar from '../../../../../ApplicationProgressBar';
import { TIME_AND_DATE_FORMAT, DATE_TEXT_FORMAT } from 'global/utils/dates/constants';
import { getFormattedDate, getStatusText } from './helpers';
import ButtonGroup from './ButtonGroup';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ApplicationSummary } from 'components/pages/Applications/types';

import { getConfig } from 'global/config';
import { isRenewalPeriodEnded } from 'global/utils/dates/helpers';

export interface StatusDates {
  lastUpdatedAtUtc: string;
  createdAtUtc: string;
  submittedAtUtc: string;
  closedAtUtc: string;
  approvedAtUtc: string;
  attestedAtUtc: string;
  attestationByUtc: string;
  lastPausedAtUtc?: string;
  expiresAtUtc: string;
}

const getStatusDate = (application: ApplicationSummary): any => {
  const {
    state,
    expiresAtUtc,
    closedAtUtc,
    approvedAtUtc,
    attestationByUtc,
    isAttestable,
    ableToRenew,
    lastPausedAtUtc,
    renewalAppId,
  } = application;
  switch (true) {
    case state === ApplicationState.PAUSED:
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.error};
          `}
        >
          {`! Access Paused: ${getFormattedDate(
            lastPausedAtUtc || attestationByUtc,
            DATE_TEXT_FORMAT,
          )}`}
        </div>
      );
      break;
    case isAttestable:
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.error};
          `}
        >{`! Access Pausing: ${getFormattedDate(attestationByUtc, DATE_TEXT_FORMAT)}`}</div>
      );
      break;
    case state === ApplicationState.EXPIRED:
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.error};
          `}
        >
          {`! Access Expired: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`}
        </div>
      );
      break;
    // ableToRenew becomes false once a renewal is created, but we still want to display the "Expiring" text state
    case ableToRenew || (renewalAppId && state === ApplicationState.APPROVED):
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.error};
          `}
        >{`! Access Expiring: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`}</div>
      );
      break;
    case expiresAtUtc && !closedAtUtc:
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.secondary};
          `}
        >{`Access Expiry: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`}</div>
      );
      break;
    case !!closedAtUtc && !!approvedAtUtc:
      return (
        <div
          css={(theme) => css`
            color: ${theme.colors.error};
          `}
        >{`Access Expired: ${getFormattedDate(closedAtUtc, DATE_TEXT_FORMAT)}`}</div>
      );
      break;
    default:
      return null;
  }
};

const InProgress = ({ application }: { application: ApplicationSummary }) => {
  const theme = useTheme();
  const { NEXT_PUBLIC_DACO_SURVEY_URL } = getConfig();

  const {
    appId,
    applicant: {
      info: { primaryAffiliation },
    },
    state,
    lastUpdatedAtUtc,
    approvedAtUtc,
    revisionsRequested,
    isAttestable,
    ableToRenew,
    renewalAppId,
    expiresAtUtc,
  } = application;

  const statusDate = getStatusDate(application);
  const statusError =
    isAttestable ||
    ableToRenew ||
    (renewalAppId &&
      [ApplicationState.APPROVED, ApplicationState.EXPIRED].includes(state) &&
      !isRenewalPeriodEnded(expiresAtUtc)) ||
    state === ApplicationState.PAUSED ||
    (revisionsRequested &&
      [ApplicationState.REVISIONS_REQUESTED, ApplicationState.SIGN_AND_SUBMIT].includes(state));

  return (
    <DashboardCard title={`Application: ${appId}`} subtitle={primaryAffiliation} info={statusDate}>
      <div
        css={css`
          margin-top: 5px;
        `}
      >
        <ProgressBar state={state} />

        <Typography
          variant="data"
          as="div"
          css={css`
            margin-top: 28px;
            margin-bottom: 30px;
            height: 47px;
          `}
        >
          <div
            css={css`
              margin-bottom: 5px;
            `}
          >
            <b>Status:</b>{' '}
            <span
              css={css`
                color: ${statusError ? theme.colors.error : 'inherit'};
              `}
            >
              {getStatusText(application)}
            </span>
          </div>
          <div>
            <b>Last Updated:</b> {getFormattedDate(lastUpdatedAtUtc, TIME_AND_DATE_FORMAT)}
          </div>
        </Typography>

        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin: 0;
            height: 50px;
            flex-wrap: nowrap;
          `}
        >
          <div
            css={css`
              min-width: 160px;
            `}
          >
            <ButtonGroup
              appId={appId}
              state={state}
              requiresAttestation={isAttestable}
              ableToRenew={ableToRenew}
            />
          </div>
          <div
            css={css`
              max-width: 330px;
            `}
          >
            {approvedAtUtc && state === ApplicationState.CLOSED && (
              <div
                css={(theme) => css`
                  padding: 6px 10px 6px 14px;
                  background-color: ${theme.colors.secondary_4};
                  border: 1px solid ${theme.colors.secondary_2};
                  border-radius: 8px;
                `}
              >
                <Typography variant="data" bold>
                  <Link href={NEXT_PUBLIC_DACO_SURVEY_URL} target="_blank">
                    Please fill out the required final report
                  </Link>{' '}
                  describing your experience with ICGC Controlled Data.
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default InProgress;
