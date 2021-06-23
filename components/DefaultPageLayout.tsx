import { ReactElement, ReactNode } from 'react';
import { PageContainer } from '@icgc-argo/uikit/PageLayout';
import { styled } from '@icgc-argo/uikit/index';

import { PageHead } from './Head';
import Footer from './Footer';
import NavBar from './NavBar';

const ThreeRowPageContainer = styled(PageContainer)`
  background: none;
  grid-template-rows: 58px 1fr 110px;
`;

const DefaultPageLayout = ({
  className = '',
  children,
  title = '',
}: {
  className?: string;
  children: ReactNode;
  title?: string;
}): ReactElement => {
  return (
    <ThreeRowPageContainer>
      <PageHead title={title} />
      <NavBar />
      <main className={className}>{children}</main>
      <Footer />
    </ThreeRowPageContainer>
  );
};

export default DefaultPageLayout;
