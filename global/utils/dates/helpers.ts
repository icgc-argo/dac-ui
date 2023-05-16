import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ApplicationData } from 'components/pages/Applications/types';
import { format, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { DateFormat } from './types';

export const isRenewalPeriodEnded = (sourceRenewalPeriodEndDateUtc?: string): boolean => {
  if (!sourceRenewalPeriodEndDateUtc) {
    return false;
  }
  const now = new Date();
  const endDate = new Date(sourceRenewalPeriodEndDateUtc);
  return isAfter(now, endDate);
};

export const sourceAppIsWithinRenewalPeriod = (appData: ApplicationData): boolean => {
  const { renewalAppId, state, ableToRenew, sourceRenewalPeriodEndDateUtc } = appData;
  return (
    ableToRenew ||
    (!!renewalAppId &&
      [ApplicationState.APPROVED, ApplicationState.EXPIRED, ApplicationState.PAUSED].includes(
        state,
      ) &&
      !isRenewalPeriodEnded(sourceRenewalPeriodEndDateUtc))
  );
};

// customize month abbreviations so DateFormat does not need to add a '.'
// ensures May does not get an unnecessary '.'
const monthAbbr: string[] = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May',
  'Jun.',
  'Jul.',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.',
];

const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    month: (token: number) => monthAbbr[token],
  } as Locale['localize'],
};

export const getFormattedDate = (value: string | number | Date, dateFormat: DateFormat): string => {
  const valueAsDate = new Date(value);
  if (valueAsDate.toString() === 'Invalid Date') {
    console.warn(`${value} is not a valid date.`);
    return '';
  }
  return format(valueAsDate, dateFormat, { locale: customLocale });
};
