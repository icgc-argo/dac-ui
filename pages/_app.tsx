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
import { useRouter } from 'next/router';
import refreshJwt from 'global/utils/auth/refreshJwt';
import logoutUtil from 'global/utils/auth/logoutUtil';
import NewWebsiteNotice from 'components/pages/NewWebsiteNotice';
import { UserProvider } from 'global/hooks/useUserContext';

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

  const logout = () => {
    logoutUtil({ handleTokenState: setInitialJwt, isManual: false, isPublic: Component.isPublic });
  };

  useEffect(() => {
    const handleAuth = async () => {
      console.log('APP handleAuth');
      const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
      if (egoJwt) {
        if (isValidJwt(egoJwt)) {
          console.log('APP valid localStorage token', egoJwt.slice(-10));
          setInitialJwt(egoJwt);
        } else {
          console.log('APP non valid localStorage token');
          const refreshedJwt = (await refreshJwt().catch(logout)) as string;
          if (isValidJwt(refreshedJwt)) {
            console.log('APP valid refreshed token', refreshedJwt.slice(-10));
            setInitialJwt(refreshedJwt);
          } else {
            console.log('APP non valid refreshed token', refreshedJwt.slice(-10));
            logout();
          }
        }
      } else {
        console.log('APP no localStorage token');
        logout();
      }
    };
    if (!ctx.query?.session_expired) {
      handleAuth();
    }
  });

  return ctx.pathname === NEW_WEBSITE_NOTICE_PATH ? (
    <NewWebsiteNotice />
  ) : (
    <UserProvider ctx={ctx}>
      {/* TODO: move inside root. this is here so i can debug in root. */}
      <Root egoJwt={initialJwt} pageContext={ctx} setInitialJwt={setInitialJwt}>
        <Component {...pageProps} />
      </Root>
    </UserProvider>
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
