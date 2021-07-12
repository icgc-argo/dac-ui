import packageJson from 'package.json';

export const APP_VERSION = packageJson.version;

export const EGO_JWT_KEY = 'egoJwt';

export const ADMIN_APPLICATIONS_LABEL = 'Manage Applications';
export const APPLICANT_APPLICATIONS_LABEL = 'My Applications';

export const DATE_RANGE_DISPLAY_FORMAT = 'Y-MM-dd';

export const DATE_TEXT_FORMAT = 'MMM. dd, yyyy';

export * from './externalPaths';
export * from './internalPaths';
