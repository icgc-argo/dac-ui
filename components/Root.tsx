import React from 'react';
import { css } from '@emotion/core';
import ReactDOM from 'react-dom';

import ThemeProvider from '@icgc-argo/uikit/ThemeProvider';
import Modal from '@icgc-argo/uikit/Modal';

import Head from 'components/Head';
import { AuthProvider } from 'global/hooks/useAuthContext';
import DefaultPageLayout from './DefaultPageLayout';
import { PageContext } from 'global/hooks/usePageContext';

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
export const ModalPortal = ({ children }: { children: React.ReactElement }) => {
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
      <Head />
      <AuthProvider egoJwt={egoJwt}>
        <PageContext.Provider value={pageContext}>
          <ThemeProvider>
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
            <DefaultPageLayout>
              {children}
            </DefaultPageLayout>
          </ThemeProvider>
        </PageContext.Provider>
      </AuthProvider>
    </React.Fragment>
  );
};

export default Root;
