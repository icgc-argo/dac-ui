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

import React from 'react';
import { css } from '@emotion/core';
import ReactDOM from 'react-dom';

import ThemeProvider from '@icgc-argo/uikit/ThemeProvider';
import Modal from '@icgc-argo/uikit/Modal';

import Head from 'components/Head';
import { AuthProvider } from 'global/hooks/useAuthContext';
import { PageContext } from 'global/hooks/usePageContext';
import DefaultPageLayout from './DefaultPageLayout';
import { ToasterContext, useToastState } from 'global/hooks/useToaster';
import ToastStack from '@icgc-argo/uikit/notifications/ToastStack';
import GdprBanner from './GdprBanner';

/**
 * The global portal where modals will show up
 */

const fillAvailableWidth = css`
  width: -webkit-fill-available;
  width: -moz-available;
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

const fillAvailableHeight = css`
  height: -webkit-fill-available;
  height: -moz-available;
  min-height: -webkit-fill-available;
  min-height: -moz-available;
`;

const modalPortalRef = React.createRef<HTMLDivElement>();
const useMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
};
export const ModalPortal = ({
  children,
  modalWidth = 'auto',
}: {
  children: React.ReactElement;
  modalWidth?: string;
}) => {
  const ref = modalPortalRef.current;
  const mounted = useMounted();
  return ref
    ? ReactDOM.createPortal(
        <div
          id="modalContainer"
          css={css`
            transition: all 0.2s;
            opacity: ${mounted ? 1 : 0};
            #modal-action-btn_google-logo {
              position: relative;
              padding-left: 34px;
              &::before {
                position: absolute;
                display: block;
                content: ' ';
                background-image: url('/icons-google.svg');
                background-size: 18px 19px;
                background-repeat: no-repeat;
                height: 18px;
                width: 19px;
                left: 11px;
              }
            }
          `}
        >
          <Modal.Overlay
            css={css`
              ${fillAvailableWidth}
              ${fillAvailableHeight}
            > div {
                /* selects Uikit ModalContainer component */
                width: ${modalWidth};
              }
              @media (min-width: 768px) {
                width: 100vw;
                height: 100vh;
              }
            `}
          >
            {children}
          </Modal.Overlay>
        </div>,
        ref,
      )
    : null;
};

export const CSSGlobalReset = () => (
  <style>
    {`
body {
  margin: 0;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
} /* custom! */
#__next {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
`}
  </style>
);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toaster = useToastState();
  return (
    <ToasterContext.Provider value={toaster}>
      {children}
      <div
        className="toastStackContainer"
        css={css`
          position: fixed;
          z-index: 9999;
          right: 0px;
          top: 80px;
        `}
      >
        <div
          css={css`
            margin-right: 20px;
            margin-left: 20px;
          `}
        >
          <ToastStack toastConfigs={toaster.toastStack} onInteraction={toaster.onInteraction} />
        </div>
      </div>
    </ToasterContext.Provider>
  );
};

const Root = ({
  children,
  pageContext,
  egoJwt = '',
}: {
  children: any;
  pageContext: any;
  egoJwt?: string;
}) => {
  return (
    <React.Fragment>
      <CSSGlobalReset />
      <Head />
      <AuthProvider>
        <PageContext.Provider value={pageContext}>
          <ThemeProvider>
            <ToastProvider>
              <div
                css={css`
                  position: fixed;
                  left: 0px;
                  top: 0px;
                  z-index: 9999;
                  ${fillAvailableWidth}
                `}
                ref={modalPortalRef}
              />
              <GdprBanner />
              <DefaultPageLayout>{children}</DefaultPageLayout>
            </ToastProvider>
          </ThemeProvider>
        </PageContext.Provider>
      </AuthProvider>
    </React.Fragment>
  );
};

export default Root;
