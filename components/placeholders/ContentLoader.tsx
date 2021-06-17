import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';

import DNALoader from './DNALoader';

const ContentLoader = ({
  title = '',
  subtitle = ''
}: {
  title?: string;
  subtitle?: string;
}) => {
  return (
    <ContentPlaceholder
      title={title}
      subtitle={subtitle}
    >
      <DNALoader />
    </ContentPlaceholder>
  );
};

export default ContentLoader;
