import React from 'react';
import { PageBody, PageContent } from '@icgc-argo/uikit/PageLayout';
import NavBar from './NavBar';
import Footer from './Footer';

const DefaultPageLayout = () => {
  return (
    <div>
      <NavBar />
      <PageBody className="noSidebar">
        <PageContent></PageContent>
      </PageBody>
      <Footer />
    </div>
  );
};

export default DefaultPageLayout;
