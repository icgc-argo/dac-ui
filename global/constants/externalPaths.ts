import { getConfig } from 'global/config';
import urlJoin from 'url-join';

const {
  NEXT_PUBLIC_ARGO_DOCS_ROOT,
  NEXT_PUBLIC_ARGO_ROOT,
  NEXT_PUBLIC_ARGO_PLATFORM_ROOT,
  NEXT_PUBLIC_DAC_API_ROOT,
} = getConfig();

export const DACO_ROOT = 'https://daco.icgc-argo.org';
export const ARGO_ROOT = NEXT_PUBLIC_ARGO_PLATFORM_ROOT;
export const HOMEPAGE_ARGO_LINK = 'https://www.icgc-argo.org/';
const ARGO_POLICIES = urlJoin(NEXT_PUBLIC_ARGO_ROOT, 'page');
export const CONTACT_PAGE = urlJoin(NEXT_PUBLIC_ARGO_PLATFORM_ROOT, 'contact');
export const POLICIES_PAGE = NEXT_PUBLIC_ARGO_ROOT; // tbd
export const HELP_PAGE = NEXT_PUBLIC_ARGO_DOCS_ROOT; // tbd
export const CONTROLLED_DATA_USERS_PAGE = NEXT_PUBLIC_ARGO_ROOT; // tbd

export const PRIVACY_POLICY_PAGE = urlJoin(ARGO_POLICIES, '2/privacy');
export const TERMS_PAGE = urlJoin(ARGO_POLICIES, '1/terms-and-conditions');
export const PUBLICATION_POLICY_PAGE = urlJoin(ARGO_POLICIES, '77/e3-publication-policy');

export const GLASGOW_UNI_LINK = 'https://www.gla.ac.uk/';
export const OICR_LINK = 'https://www.oicr.on.ca/';
export const ICGC_DCC_LINK = 'https://dcc.icgc.org/';
export const ICGC_PCAWG_LINK = urlJoin(ICGC_DCC_LINK, 'pcawg');
export const DOCUSIGN_LINK = 'https://www.docusign.ca';
export const ADOBE_ACROBAT_LINK = 'https://acrobat.adobe.com/us/en/sign.html';

export const ICGC_ARGO_FAQS = 'https://docs.icgc-argo.org/docs/data-access/daco/daco-faq';
export const DACO_APPLYING_DOCS = 'https://docs.icgc-argo.org/docs/data-access/daco/applying';

// API
export const API = {
  APP_PACKAGE: '/assets/APP_PACKAGE',
  APPLICATIONS: '/applications',
  HEALTH: '/health',
};
