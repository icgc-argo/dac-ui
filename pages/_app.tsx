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

import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Root, { PageRootFragment } from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';
import { getConfig } from 'global/config';
import { ThemeProvider } from '@icgc-argo/uikit';

const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  const [initialJwt, setInitialJwt] = useState<string>('');
  const { NEXT_PUBLIC_MAINTENANCE_MODE_ON } = getConfig();

  useEffect(() => {
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    if (isValidJwt(egoJwt)) {
      setInitialJwt(egoJwt);
    } else {
      setInitialJwt('');
      localStorage.removeItem(EGO_JWT_KEY);
      // redirect to logout when token is expired/missing only if user is on a non-public page
      if (!Component.isPublic) {
        Router.push({
          pathname: '/',
          query: { session_expired: true },
        });
      }
    }
  });
  return NEXT_PUBLIC_MAINTENANCE_MODE_ON ? (
    <Maintenance />
  ) : (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      <Component {...pageProps} />{' '}
    </Root>
  );
};

App.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
  const pageProps = Component.getInitialProps && (await Component.getInitialProps({ ...ctx }));
  return {
    ctx: {
      pathname: ctx.pathname,
      query: ctx.query,
      asPath: ctx.asPath,
    },
    pageProps,
  };
};

export default App;
