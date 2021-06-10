import { ApplicationState } from 'components/pages/ProgressBar';
import { format as formatDate } from 'date-fns';
import { SIMPLE_DATE_FORMAT } from './constants';

export const getStatusText = (state: ApplicationState, date: string | number | Date) => {
  const formattedDate = date ? formatDate(new Date(date), SIMPLE_DATE_FORMAT) : '';

  switch (state) {
    case 1:
      return `Approved on ${formattedDate}. You now have access to ICGC Controlled Data.`;
    case 2:
      return `Created on ${formattedDate}.`;
    case 3:
      return `Submitted on ${formattedDate}. This application is locked for ICGC DACO review.`;
    case 4:
      return `Reopened on ${formattedDate}. Revision details were sent via email.`;
    case 5:
      return `Rejected on ${formattedDate}. This application cannot be reopened, reasons were sent via email.`;
    case 6:
      return `Closed on ${formattedDate}. You can reopen this application at anytime.`;
    case 7:
      `Closed on ${formattedDate}.`;
    default:
      return '';
  }
};

export const getFormattedDate = (date: string | number | Date, format: string) =>
  date ? formatDate(new Date(date), format) : '';
