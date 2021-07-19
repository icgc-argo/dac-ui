import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { format as formatDate } from 'date-fns';
import { DATE_TEXT_FORMAT } from 'global/constants';
import { StatusDates } from '.';

export const getStatusText = (state: ApplicationState, dates: StatusDates) => {
  const formatStatusDate = (date: string) =>
    formatDate(new Date(date || dates.lastUpdatedAtUtc), DATE_TEXT_FORMAT);
  switch (state) {
    case ApplicationState.APPROVED:
      return `Approved on ${formatStatusDate(
        dates.approvedAtUtc,
      )}. You now have access to ICGC Controlled Data.`;
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.DRAFT:
      return `Created on ${formatStatusDate(dates.createdAtUtc)}.`;
    case ApplicationState.REVIEW:
      return `Submitted on ${formatStatusDate(
        dates.submittedAtUtc,
      )}. This application is locked for ICGC DACO review.`;
    case ApplicationState.REVISIONS_REQUESTED:
      return `Reopened on ${formatStatusDate(
        dates.lastUpdatedAtUtc,
      )}. Revision details were sent via email.`;
    case ApplicationState.REJECTED:
      return `Rejected on ${formatStatusDate(
        dates.lastUpdatedAtUtc,
      )}. This application cannot be reopened, reasons were sent via email.`;
    case ApplicationState.CLOSED:
      return `Closed on ${formatStatusDate(
        dates.closedAtUtc,
      )}. You can reopen this application at anytime.`;
    case ApplicationState.RENEWING:
      return `Closed on ${formatStatusDate(dates.closedAtUtc)}.`;
    default:
      return '';
  }
};

export const getFormattedDate = (date: string | number | Date, format: string) =>
  date ? formatDate(new Date(date), format) : '';
