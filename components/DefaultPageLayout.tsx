import React from 'react';
import { PageBody, PageContent } from '@icgc-argo/uikit/PageLayout';
import NavBar from './NavBar';
import Footer from './Footer';
import { PageHead } from './Head';

const DefaultPageLayout = ({
  children,
  title = '',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div>
      <PageHead title={title} />
      <NavBar />
      <PageBody className="noSidebar">
        <PageContent>{children}</PageContent>
      </PageBody>
      <Footer />
    </div>
  );
};

export default DefaultPageLayout;
