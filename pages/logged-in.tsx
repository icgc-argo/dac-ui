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

import { css } from '@emotion/core';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';
import { APPLICATIONS_PATH } from 'global/constants';
import useAuthContext from 'global/hooks/useAuthContext';
import { createPage } from 'global/utils/pages/createPage';
import Router from 'next/router';
import { useEffect } from 'react';

/**
 * local storage stuff seperate issue
 * closing tab
 * multiple tabs etc
 * seperate hook probably
 */
/**
 * <AuthorizationProv>
 * <UserProvider this gets egojwt
 */

const LoginLoaderPage = createPage({
  getInitialProps: async (ctx) => {
    const { egoJwt, asPath, query } = ctx;
    return { egoJwt, query, asPath };
  },
  isPublic: true,
})(() => {
  const auth = useAuthContext();
  console.log('auth token state', auth.token);

  if (auth.token) {
    Router.push(APPLICATIONS_PATH);
  }

  useEffect(() => {
    Router.prefetch(APPLICATIONS_PATH);
    console.log('mounted');
    const doFetchStuff = async () => {
      const jwt = await auth.fetchInitEgo();
      //console.log('do fetch stuff', jwt);
    };
    doFetchStuff();
  }, []);

  // don't use AuthProv loading state here as it will cause re-mounting of page
  return (
    <div
      css={css`
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      `}
    >
      <DnaLoader />
    </div>
  );
});

export default LoginLoaderPage;
