import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import Icon from '@icgc-argo/uikit/Icon';

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
      <DnaLoader />
    </ContentPlaceholder>
  );
};

export default ContentLoader;
