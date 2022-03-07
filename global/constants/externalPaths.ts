/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { AppendixEnum } from 'components/pages/Applications/types';
import { getConfig } from 'global/config';
import urlJoin from 'url-join';

const {
  NEXT_PUBLIC_ARGO_ROOT,
  NEXT_PUBLIC_ARGO_PLATFORM_ROOT,
  NEXT_PUBLIC_ARGO_DOCS_ROOT,
} = getConfig();

export const DACO_ROOT = 'https://daco.icgc-argo.org';
export const ARGO_ROOT = NEXT_PUBLIC_ARGO_PLATFORM_ROOT;
const ARGO_DOCS_URL = urlJoin(NEXT_PUBLIC_ARGO_DOCS_ROOT, 'docs');

const ARGO_POLICIES = urlJoin(NEXT_PUBLIC_ARGO_ROOT, 'page');
export const CONTACT_PAGE = urlJoin(NEXT_PUBLIC_ARGO_PLATFORM_ROOT, 'contact');
export const POLICIES_PAGE = urlJoin(ARGO_POLICIES, '72/introduction-and-goals');
export const HELP_PAGE = urlJoin(ARGO_DOCS_URL, '/data-access/daco/applying');
export const CONTROLLED_DATA_POLICY = urlJoin(
  ARGO_POLICIES,
  '132/data-access-and-data-use-policies-and-guidelines',
);
export const CONTROLLED_DATA_USERS_PAGE = urlJoin(ARGO_POLICIES, '139/controlled-data-users');
export const DATA_ACCESS_COMPLIANCE_PAGE = urlJoin(
  ARGO_POLICIES,
  '136/e83-data-access-compliance-office-policies-and-procedures',
);
export const PROJECT_LIST_PAGE = urlJoin(ARGO_POLICIES, '89/project-list');
export const PRIVACY_POLICY_PAGE = urlJoin(ARGO_POLICIES, '2/privacy');
export const TERMS_PAGE = urlJoin(ARGO_POLICIES, '1/terms-and-conditions');
export const PUBLICATION_POLICY_PAGE = urlJoin(ARGO_POLICIES, '77/e3-publication-policy');
export const DATA_ACCESS_FRAMEWORK_PAGE = urlJoin(ARGO_POLICIES, '134/e81-data-access-framework');
export const DATA_BREACH_POLICY_PAGE = urlJoin(ARGO_POLICIES, '137/e84-data-breach-policy');

export const GLASGOW_UNI_LINK = 'https://www.gla.ac.uk/';
export const OICR_LINK = 'https://www.oicr.on.ca/';
export const ICGC_DCC_LINK = 'https://dcc.icgc.org/';
export const ICGC_PCAWG_LINK = urlJoin(ICGC_DCC_LINK, 'pcawg');
export const DOCUSIGN_LINK = 'https://www.docusign.ca';
export const ADOBE_ACROBAT_LINK = 'https://acrobat.adobe.com/us/en/sign.html';

export const ICGC_ARGO_FAQS = urlJoin(ARGO_DOCS_URL, '/data-access/daco/daco-faq');
export const DACO_APPLYING_DOCS = urlJoin(
  ARGO_DOCS_URL,
  '/data-access/daco/applying#eligible-project-guidelines',
);

export const LAY_SUMMARY_GUIDE = urlJoin(ARGO_DOCS_URL, 'data-access/daco/lay-summary-guide');

const ICGC_ARGO_IP_POLICIES = urlJoin(ARGO_POLICIES, '78/e4-intellectual-property');

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
  COLLABORATOR_APPS: '/collaborators/applications',
};
