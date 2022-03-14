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
import {
  APPROVED_APP_CLOSED_CHECK,
  EGO_JWT_KEY,
  NEW_WEBSITE_NOTICE_PATH,
  SUBMISSION_SUCCESS_CHECK,
} from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router, { useRouter } from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';
import { getConfig } from 'global/config';
import NewWebsiteNotice from 'components/pages/NewWebsiteNotice';

const resetFlashData = () => {
  [SUBMISSION_SUCCESS_CHECK, APPROVED_APP_CLOSED_CHECK].forEach((key) =>
    localStorage.setItem(key, ''),
  );
};

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

  const router = useRouter();

  // set up router event listeners
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // only reset if page has changed, not just queries
      if (url.split('?')[0] !== window.location.pathname) {
        resetFlashData();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

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
  ) : ctx.pathname === NEW_WEBSITE_NOTICE_PATH ? (
    <NewWebsiteNotice />
  ) : (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      <Component {...pageProps} />
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
