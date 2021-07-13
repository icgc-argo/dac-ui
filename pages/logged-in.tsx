/*
 *
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { useEffect } from 'react';
import { css } from '@emotion/core';
import urlJoin from 'url-join';
import Router, { useRouter } from 'next/router';
import queryString from 'query-string';

import DnaLoader from '@icgc-argo/uikit/DnaLoader';

import DefaultPageLayout from 'components/DefaultPageLayout';
import { getConfig } from 'global/config';
import { APPLICATIONS_PATH, EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import { createPage } from 'global/utils/pages/createPage';

const fetchEgoToken = (redirectPage: string) => {
  const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
  const egoLoginUrl = urlJoin(
    NEXT_PUBLIC_EGO_API_ROOT,
    `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
  );

  fetch(egoLoginUrl, {
    credentials: 'include',
    headers: { accept: '*/*' },
    body: null,
    method: 'POST',
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      }
      return res.text();
    })
    .then((jwt) => {
      if (isValidJwt(jwt)) return localStorage.setItem(EGO_JWT_KEY, jwt);
      throw new Error('Invalid jwt, cannot login.');
    })
    .then(() => Router.push(redirectPage))
    .catch((err) => {
      console.warn(err);
      localStorage.removeItem(EGO_JWT_KEY);
      Router.push('/');
    });
};

const LoginLoaderPage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt, asPath, query } = ctx;
    console.log('login', ctx)
    return { egoJwt, query, asPath };
  },
  isPublic: true,
})(() => {
  // can i get the initial props above somehow?
  const router = useRouter();
  const { redirect = '' } = router.query;
  const redirectPage = (typeof redirect === 'string' ? redirect : redirect[0]) ||
    APPLICATIONS_PATH;
  useEffect(() => {
    Router.prefetch(redirectPage);
    fetchEgoToken(redirectPage);
  }, []);

  return (
    <DefaultPageLayout
      css={css`
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <DnaLoader />
    </DefaultPageLayout>
  );
});

export default LoginLoaderPage;
