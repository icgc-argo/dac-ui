import { addDays, isAfter } from 'date-fns';
import { getConfig } from 'global/config';

// calculate the last day an app can be renewed, expiry + configured days post expiry
// DACO allows 90 days after expiry to renew
export const getRenewalPeriodEndDate = (expiryDate: string): string => {
  const expiry = new Date(expiryDate);
  const { NEXT_PUBLIC_DAYS_POST_EXPIRY } = getConfig();
  // TODO: Can the configured days after expiry be retrieved from the BE?
  return addDays(expiry, NEXT_PUBLIC_DAYS_POST_EXPIRY).toDateString();
};

export const isRenewalPeriodEnded = (expiryDate: string): boolean => {
  const now = new Date();
  const endDate = new Date(getRenewalPeriodEndDate(expiryDate));
  return isAfter(now, endDate);
};
