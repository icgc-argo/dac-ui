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
import { NextRouter, useRouter } from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';
import { getConfig } from 'global/config';
import refreshJwt from 'global/utils/refreshJwt';
import Loader from 'components/Loader';

const authSkipPaths = [LOGGED_IN_PATH];

const checkAuthSkip = (router: NextRouter): boolean => {
  const { asPath } = router;
  return authSkipPaths.includes(asPath);
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
  const [isAuthLoading, setAuthLoading] = useState<boolean>(true);
  const { NEXT_PUBLIC_MAINTENANCE_MODE_ON } = getConfig();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    // redirect to logout when token is expired/missing only if user is on a non-public page
    if (!Component.isPublic) {
      router.push({
        pathname: '/',
        query: { session_expired: true },
      });
    }
  };

  useEffect(() => {
    if (checkAuthSkip(router)) {
      setAuthLoading(false);
      return;
    }
    setAuthLoading(true);
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';

    !egoJwt && logout();
    (!egoJwt || isValidJwt(egoJwt)) && setAuthLoading(false);

    if (egoJwt && !isValidJwt(egoJwt)) {
      refreshJwt()
        .then((newJwt) => {
          if (isValidJwt(newJwt)) {
            localStorage.setItem(EGO_JWT_KEY, newJwt);
          } else {
            logout();
          }
        })
        .catch((err) => {
          logout();
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, [router.asPath]);
  return (
    <Root pageContext={ctx}>
      {NEXT_PUBLIC_MAINTENANCE_MODE_ON
        ? <Maintenance />
        : isAuthLoading
          ? <Loader />
          : <Component {...pageProps} />}
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
