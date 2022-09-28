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
import { css } from '@icgc-argo/uikit';
import { UikitTheme } from '@icgc-argo/uikit/index';
import PageHeader from 'components/PageHeader';
import { DATE_TEXT_FORMAT } from 'global/constants';
import Actions from './Actions';
import Details from './Details';
import Progress from './Progress';
import { RefetchDataFunction } from '../Forms/types';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ApplicationData, UpdateEvent } from '../../types';
import { findLast, sortBy } from 'lodash';

export type ApplicationAccessInfo = { date?: string; isWarning: boolean; status: string };

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
    expiresAtUtc = '',
    closedAtUtc,
    revisionsRequested,
    approvedAtUtc,
    sections: { applicant: { info: { displayName = '', primaryAffiliation = '' } = {} } = {} } = {},
    state,
    approvedAppDocs,
    isAttestable,
    attestationByUtc,
    updates,
  } = data;

  const applicant = `${displayName}${primaryAffiliation ? `. ${primaryAffiliation}` : ''}`;
  const currentApprovedDoc = approvedAppDocs.find((doc) => doc.isCurrent);

  const showRevisionsRequestedFlag =
    revisionsRequested &&
    [ApplicationState.REVISIONS_REQUESTED, ApplicationState.SIGN_AND_SUBMIT].includes(state);

  // only pass expiry for applications that have been approved
  // add 'status' key to allow easy string changes
  const accessInfo =
    state === ApplicationState.PAUSED
      ? {
          date:
            // updates should appear in asc order by date but just ensuring it
            // retrieving the most recent PAUSED event; in future applications could be paused several times
            // otherwise display calculated attestationBy date, the assumption is the app is paused due to missing attestation
            findLast(
              sortBy(updates, (u) => u.date),
              (update) => update.eventType === UpdateEvent.PAUSED,
            )?.date || attestationByUtc,
          isWarning: true,
          status: '! Paused',
        }
      : isAttestable
      ? {
          date: attestationByUtc,
          isWarning: true,
          status: '! Pausing',
        }
      : // this case will also apply to applications that are going through renewal flow (they may be in DRAFT, SIGN AND SUBMIT, REVISIONS REQUESTED or REVIEW state)
      approvedAtUtc
      ? {
          date: closedAtUtc || expiresAtUtc,
          isWarning: closedAtUtc ? true : false,
          status: closedAtUtc ? 'Expired' : 'Expires',
        }
      : undefined;

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
          createdAt={format(new Date(createdAtUtc), DATE_TEXT_FORMAT)}
          lastUpdated={format(new Date(lastUpdatedAtUtc), DATE_TEXT_FORMAT + ' h:mm aaaa')}
          accessInfo={accessInfo}
        />

        <div>
          {showRevisionsRequestedFlag ? (
            <div
              css={(theme: UikitTheme) =>
                css`
                  ${theme.typography.data};
                  background: ${theme.colors.primary_1};
                  border-radius: 8px;
                  color: ${theme.colors.white};
                  font-weight: bold;
                  margin: 0 auto 10px 72px;
                  padding: 3px 8px;
                  text-align: center;
                  width: 130px;
                `
              }
            >
              Revisions Requested
            </div>
          ) : isAttestable ? (
            <div
              css={(theme: UikitTheme) =>
                css`
                  ${theme.typography.data};
                  background: ${theme.colors.primary_1};
                  border-radius: 8px;
                  color: ${theme.colors.white};
                  font-weight: bold;
                  margin: 0 auto 10px 57px;
                  padding: 3px 8px;
                  text-align: center;
                  width: 150px;
                `
              }
            >
              Attestation Required
            </div>
          ) : null}
          <Progress state={state} />
        </div>

        <Actions
          appId={appId}
          primaryAffiliation={primaryAffiliation}
          state={state}
          refetchAllData={refetchAllData}
          approvedAtUtc={approvedAtUtc}
          currentApprovedDoc={currentApprovedDoc}
        />
      </div>
    </PageHeader>
  );
};

export default ApplicationHeader;
