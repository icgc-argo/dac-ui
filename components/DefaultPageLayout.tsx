import React from 'react';
import { PageBody, PageContent } from '@icgc-argo/uikit/PageLayout';
import NavBar from './NavBar';
import Footer from './Footer';
import { PageHead } from './Head';

const DefaultPageLayout = ({ title = '' }: { title?: string }) => {
  return (
    <div>
      <PageHead title={title} />
      <NavBar />
      <PageBody className="noSidebar">
        <PageContent></PageContent>
      </PageBody>
      <Footer />
    </div>
  );
};

export default DefaultPageLayout;
