import { addDays, format, isAfter } from 'date-fns';
import { DateFormat } from './types';

// calculate the last day an app can be renewed, expiry + configured days post expiry
// DACO allows 90 days after expiry to renew
export const getRenewalPeriodEndDate = (expiryDate: string): string => {
  const expiry = new Date(expiryDate);
  // TODO: Get rid of hardcoded num days. Can the configured days after expiry be retrieved from the BE?
  return addDays(expiry, 90).toDateString();
};

export const isRenewalPeriodEnded = (expiryDate: string): boolean => {
  const now = new Date();
  const endDate = new Date(getRenewalPeriodEndDate(expiryDate));
  return isAfter(now, endDate);
};

export const getFormattedDate = (value: string | number | Date, dateFormat: DateFormat): string => {
  const valueAsDate = new Date(value);
  if (valueAsDate.toString() === 'Invalid Date') {
    console.warn(`${value} is not a valid date.`);
    return '';
  }
  return format(valueAsDate, dateFormat);
};
