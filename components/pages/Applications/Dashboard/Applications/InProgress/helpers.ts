import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { format as formatDate } from 'date-fns';
import { DATE_TEXT_FORMAT } from 'global/constants';

export const getStatusText = (state: ApplicationState, date: string | number | Date) => {
  const formattedDate = date ? formatDate(new Date(date), DATE_TEXT_FORMAT) : '';

  switch (state) {
    case ApplicationState.APPROVED:
      return `Approved on ${formattedDate}. You now have access to ICGC Controlled Data.`;
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.DRAFT:
      return `Created on ${formattedDate}.`;
    case ApplicationState.REVIEW:
      return `Submitted on ${formattedDate}. This application is locked for ICGC DACO review.`;
    case ApplicationState.REVISIONS_REQUESTED:
      return `Reopened on ${formattedDate}. Revision details were sent via email.`;
    case ApplicationState.REJECTED:
      return `Rejected on ${formattedDate}. This application cannot be reopened, reasons were sent via email.`;
    case ApplicationState.CLOSED:
      return `Closed on ${formattedDate}. You can reopen this application at anytime.`;
    case ApplicationState.RENEWING:
      return `Closed on ${formattedDate}.`;
    default:
      return '';
  }
};

export const getFormattedDate = (date: string | number | Date, format: string) =>
  date ? formatDate(new Date(date), format) : '';
