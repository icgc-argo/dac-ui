import { AppendixEnum } from 'components/pages/Applications/types';
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
export const POLICIES_PAGE = urlJoin(HOMEPAGE_ARGO_LINK, 'page/72/introduction-and-goals');
export const HELP_PAGE = 'https://docs.icgc-argo.org/docs/data-access/daco/applying';
export const CONTROLLED_DATA_POLICY = urlJoin(
  HOMEPAGE_ARGO_LINK,
  'page/132/data-access-and-data-use-policies-and-guidelines',
);
export const CONTROLLED_DATA_USERS_PAGE = urlJoin(
  HOMEPAGE_ARGO_LINK,
  'page/139/controlled-data-users',
);

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
export const DACO_APPLYING_DOCS =
  'https://docs.icgc-argo.org/docs/data-access/daco/applying#eligible-project-guidelines';

const ICGC_ARGO_IP_POLICIES = urlJoin(HOMEPAGE_ARGO_LINK, 'page/78/e4-intellectual-property');

export const appendicesLinks = {
  [AppendixEnum.ICGC_GOALS_POLICIES]: POLICIES_PAGE,
  [AppendixEnum.DATA_ACCESS_POLICY]: CONTROLLED_DATA_POLICY,
  [AppendixEnum.IP_POLICY]: ICGC_ARGO_IP_POLICIES,
};

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
const egoLoginUrl = new URL(urlJoin(NEXT_PUBLIC_EGO_API_ROOT, 'oauth/login/google'));
egoLoginUrl.searchParams.append('client_id', NEXT_PUBLIC_EGO_CLIENT_ID);

export const EGO_LOGIN_URL = egoLoginUrl.href;

// API
export const API = {
  APP_PACKAGE: '/assets/APP_PACKAGE',
  APPLICATIONS: '/applications',
  HEALTH: '/health',
};
