import React from 'react';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import Icon from '@icgc-argo/uikit/Icon';

const ContentError = ({
  title = 'Something went wrong.',
  subtitle = 'Refresh or try again later.'
}: {
  title?: string;
  subtitle?: string;
}) => {
  return (
    <ContentPlaceholder
      title={title}
      subtitle={subtitle}
    >
      <Icon name={'bug'} />
    </ContentPlaceholder>
  );
};

export default ContentError;
