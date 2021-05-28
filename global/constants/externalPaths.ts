import urlJoin from 'url-join';

export const ARGO_ROOT = 'https://www.icgc-argo.org/';
const ARGO_DOCS_ROOT = 'https://docs.icgc-argo.org/';
export const ARGO_PLATFORM_ROOT = 'https://platform.icgc-argo.org';

const ARGO_POLICIES = urlJoin(ARGO_ROOT, 'page');

export const CONTACT_PAGE = urlJoin(ARGO_PLATFORM_ROOT, 'contact');
export const POLICIES_PAGE = ARGO_ROOT; // tbd
export const HELP_PAGE = ARGO_DOCS_ROOT; // tbd
export const CONTROLLED_DATA_USERS_PAGE = ARGO_ROOT; // tbd

export const PRIVACY_POLICY_PAGE = urlJoin(ARGO_POLICIES, '2/privacy');
export const TERMS_PAGE = urlJoin(ARGO_POLICIES, '1/terms-and-conditions');
export const PUBLICATION_POLICY_PAGE = urlJoin(ARGO_POLICIES, '77/e3-publication-policy');

export const GLASGOW_UNI_LINK = 'https://www.gla.ac.uk/';
export const OICR_LINK = 'https://www.oicr.on.ca/';
export const ICGC_DCC_LINK = 'https://dcc.icgc.org/';
export const ICGC_PCAWG_LINK = urlJoin(ICGC_DCC_LINK, 'pcawg');
