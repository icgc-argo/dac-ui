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

import { pick } from 'lodash';
import { format as formatDate } from 'date-fns';

import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ApplicationSummary } from 'components/pages/Applications/types';
import { DATE_TEXT_FORMAT } from 'global/constants';
import { StatusDates } from '.';

export const getStatusText = (application: ApplicationSummary) => {
  const {
    lastUpdatedAtUtc,
    isAttestable,
    state,
    revisionsRequested,
    ableToRenew,
    renewalAppId,
  } = application;
  const dates: StatusDates = {
    lastUpdatedAtUtc,
    ...pick(application, [
      'createdAtUtc',
      'submittedAtUtc',
      'closedAtUtc',
      'approvedAtUtc',
      'attestedAtUtc',
      'attestationByUtc',
      'lastPausedAtUtc',
      'expiresAtUtc',
    ]),
  };
  const formatStatusDate = (date: string) =>
    formatDate(new Date(date || dates.lastUpdatedAtUtc), DATE_TEXT_FORMAT);

  const revisionsRequestedText = `Reopened for revisions on ${formatStatusDate(
    dates.lastUpdatedAtUtc,
  )}. Revision details were sent via email.`;
  const createdOnText = `Created on ${formatStatusDate(dates.createdAtUtc)}.`;

  switch (state) {
    case ApplicationState.APPROVED:
      return isAttestable
        ? `An annual attestation is required for this application. Access for this project team will be paused on ${formatStatusDate(
            dates.attestationByUtc,
          )} until you submit your attestation.`
        : ableToRenew || (renewalAppId && state === ApplicationState.APPROVED)
        ? `Access is expiring soon. To extend your access privileges for another two years, please renew this application by ${formatStatusDate(
            dates.expiresAtUtc,
          )}.`
        : `Approved on ${formatStatusDate(
            dates.approvedAtUtc,
          )}. You now have access to ICGC Controlled Data.`;
    case ApplicationState.SIGN_AND_SUBMIT:
      return revisionsRequested ? revisionsRequestedText : createdOnText;
    case ApplicationState.DRAFT:
      return createdOnText;
    case ApplicationState.REVIEW:
      return `Submitted on ${formatStatusDate(
        dates.submittedAtUtc,
      )}. This application is locked for ICGC DACO review.`;
    case ApplicationState.REVISIONS_REQUESTED:
      return revisionsRequestedText;
    case ApplicationState.REJECTED:
      return `Rejected on ${formatStatusDate(
        dates.lastUpdatedAtUtc,
      )}. This application cannot be reopened, reasons were sent via email.`;
    case ApplicationState.CLOSED:
      return `Closed on ${formatStatusDate(
        dates.closedAtUtc,
      )}. This application cannot be reopened.`;
    case ApplicationState.PAUSED:
      return `Access was paused on ${formatStatusDate(
        dates.lastPausedAtUtc || dates.attestationByUtc,
      )}. Access for this project team will resume once you submit the annual attestation for this application.`;
    default:
      return '';
  }
};

export const getFormattedDate = (date: string | number | Date, format: string) =>
  date ? formatDate(new Date(date), format) : '';
