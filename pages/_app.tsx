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

import { useEffect } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import {
  APPROVED_APP_CLOSED_CHECK,
  NEW_WEBSITE_NOTICE_PATH,
  SUBMISSION_SUCCESS_CHECK,
} from 'global/constants';
import { useRouter } from 'next/router';
import NewWebsiteNotice from 'components/pages/NewWebsiteNotice';
import { getConfig } from 'global/config';
import MaintenancePage from './maintenance';

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
  const router = useRouter();
  const { NEXT_PUBLIC_MAINTENANCE_MODE_ON } = getConfig();

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

  return ctx.pathname === NEW_WEBSITE_NOTICE_PATH && !NEXT_PUBLIC_MAINTENANCE_MODE_ON ? (
    <NewWebsiteNotice />
  ) : (
    <Root pageContext={ctx}>
      {NEXT_PUBLIC_MAINTENANCE_MODE_ON ? <MaintenancePage /> : <Component {...pageProps} />}
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
