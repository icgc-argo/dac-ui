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
import { ApplicationData } from '../../types';

export type ApplicationExpiry = { date: string; isExpired: boolean; status: string };

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
    expiresAtUtc,
    closedAtUtc,
    revisionsRequested,
    approvedAtUtc,
    sections: { applicant: { info: { displayName = '', primaryAffiliation = '' } = {} } = {} } = {},
    state,
    approvedAppDocs,
    isAttestable,
    attestedAtUtc,
    attestationByUtc,
  } = data;

  const applicant = `${displayName}${primaryAffiliation ? `. ${primaryAffiliation}` : ''}`;
  const currentApprovedDoc = approvedAppDocs.find((doc) => doc.isCurrent);

  const showRevisionsRequestedFlag =
    revisionsRequested &&
    [ApplicationState.REVISIONS_REQUESTED, ApplicationState.SIGN_AND_SUBMIT].includes(state);

  const requiresAttestation = !attestedAtUtc && isAttestable;

  // only pass expiry for applications that have been approved
  // add 'status' key to allow easy string changes
  const expiry = requiresAttestation
    ? {
        date: format(new Date(attestationByUtc || ''), DATE_TEXT_FORMAT),
        isExpired: true,
        status: '! Pausing',
      }
    : approvedAtUtc
    ? {
        date: format(new Date(closedAtUtc || expiresAtUtc || ''), DATE_TEXT_FORMAT),
        isExpired: closedAtUtc ? true : false,
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
          expiry={expiry}
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
          ) : requiresAttestation ? (
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
              Attestation Requested
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
