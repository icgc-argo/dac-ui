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
import { DateFormat } from 'global/utils/dates/types';
import { StatusDates } from '.';
import { getFormattedDate, getRenewalPeriodEndDate, isRenewalPeriodEnded } from 'global/utils/dates/helpers';

export const getStatusText = (application: ApplicationSummary) => {
  const {
    lastUpdatedAtUtc,
    isAttestable,
    state,
    revisionsRequested,
    ableToRenew,
    renewalAppId,
    isRenewal,
    renewalPeriodEndDateUtc,
    sourceAppId,
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
    formatDate(new Date(date || dates.lastUpdatedAtUtc), DateFormat.DATE_TEXT_FORMAT);

  const revisionsRequestedText = `Reopened for revisions on ${formatStatusDate(
    dates.lastUpdatedAtUtc,
  )}. Revision details were sent via email.`;
  const createdOnText = `Created on ${formatStatusDate(dates.createdAtUtc)}.`;

  switch (state) {
    case ApplicationState.APPROVED:
      const approvedAppRenewalEndDate = getFormattedDate(
            getRenewalPeriodEndDate(dates.expiresAtUtc),
            DateFormat.DATE_TEXT_FORMAT,
          );
      return isAttestable
        ? `An annual attestation is required for this application. Access for this project team will be paused on ${getFormattedDate(
            dates.attestationByUtc,
            DateFormat.DATE_TEXT_FORMAT,
          )} until you submit your attestation.`
        : ableToRenew
        ? `Access is expiring soon. To extend your access privileges for another two years, please renew this application by ${approvedAppRenewalEndDate}.`
        : renewalAppId
        ? `An application renewal has been created. Please complete application ${renewalAppId} to extend your access privileges for another two years. This must be completed by ${approvedAppRenewalEndDate}.`
        : `Approved on ${formatStatusDate(
            dates.approvedAtUtc,
          )}. You now have access to ICGC Controlled Data.`;
    case ApplicationState.SIGN_AND_SUBMIT:
      // TODO: any need to differentiate a renewal with revisions vs a new app with revisions?
      return revisionsRequested
        ? revisionsRequestedText
        : isRenewal
        ? `Renewal created on ${formatStatusDate(
            dates.createdAtUtc,
          )} from ${sourceAppId}. Please submit this application for review by ${formatStatusDate(
            renewalPeriodEndDateUtc,
          )} to extend your access for another two years.`
        : createdOnText;
    case ApplicationState.DRAFT:
      return isRenewal
        ? `Renewal created on ${formatStatusDate(
            dates.createdAtUtc,
          )} from ${sourceAppId}. Please submit this application for review by ${formatStatusDate(
            renewalPeriodEndDateUtc,
          )} to extend your access for another two years.`
        : createdOnText;
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
    case ApplicationState.EXPIRED:
      const expiredAppRenewalEndDate = getFormattedDate(
        getRenewalPeriodEndDate(dates.expiresAtUtc),
        DateFormat.DATE_TEXT_FORMAT,
      );
      return ableToRenew
        ? `Access has expired. To extend your access privileges for another two years, please renew this application by ${expiredAppRenewalEndDate}.`
        : renewalAppId && !isRenewalPeriodEnded(dates.expiresAtUtc)
        ? `An application renewal has been created. Please complete application ${renewalAppId} to extend your access privileges for another two years. This must be completed by ${expiredAppRenewalEndDate}.`
        : 'The renewal period for this application has ended. If you have not completed a renewal application, you will need to start a new application to gain access privileges for another two years.';
    default:
      return '';
  }
};
