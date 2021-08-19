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
import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY, LOGGED_IN_PATH } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';

// START REFRESH JWT SETUP
import Queue from 'promise-queue';
import urlJoin from 'url-join';
import { getConfig } from 'global/config';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);
const refreshUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/oauth/refresh?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`
);

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

  const logoutToHomepage = () => {
    console.log('💀 _app - logout to homepage');
    setInitialJwt('');
    localStorage.removeItem(EGO_JWT_KEY);
    // redirect to logout when token is expired/missing only if user is on a non-public page
    if (!Component.isPublic) {
      Router.push({
        pathname: '/',
        query: { app_session_expired: true },
      });
    }
  };

  useEffect(() => {
    console.log('🏎 _app - start useEffect - initialJwt in state:', initialJwt.slice(-10));
    if (ctx.asPath?.includes(LOGGED_IN_PATH)) return; // logged-in page handles its own auth
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    console.log('🎟 _app - initial localStorage JWT:', egoJwt.slice(-10));
    if (isValidJwt(egoJwt)) {
      console.log('✅ _app - initial localStorage JWT is valid:', egoJwt.slice(-10));
      setInitialJwt(egoJwt);
    } else if (egoJwt) {
      console.log('⏸ _app - initial localStorage JWT is NOT valid:', egoJwt.slice(-10));
      // if jwt isn't valid, check for refresh token
      queue.add(() =>
        fetch(refreshUrl, {
          credentials: 'include', // sends refreshId cookie
          headers: {
            accept: '*/*',
            authorization: `Bearer ${egoJwt}`,
          },
          method: 'POST',
        })
          .then(res => res.text())
          .then(refreshedJwt => {
            if (isValidJwt(refreshedJwt)) {
              console.log('🎉 _app - refresh token IS valid:', refreshedJwt.slice(-10));
              setInitialJwt(refreshedJwt);
              localStorage.setItem(EGO_JWT_KEY, refreshedJwt);
            } else {
              console.log('💥 _app - refresh token NOT valid:', refreshedJwt);
              logoutToHomepage();
            }
          })
          .catch((err) => {
            console.log('🧤 _app - refresh token error:', err);
            logoutToHomepage();
          })
      );
    } else {
      logoutToHomepage();
    }
  }); // dependencies currently cause page header to not update

  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      {NEXT_PUBLIC_MAINTENANCE_MODE_ON ? <Maintenance /> : <Component {...pageProps} />}
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
