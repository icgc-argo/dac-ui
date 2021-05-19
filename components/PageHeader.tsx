import { ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import { ContentHeader } from '@icgc-argo/uikit/PageLayout';

const PageHeader = ({ children }: { children: ReactElement }): ReactElement => (
  <ContentHeader
      css={css`
        background: #f8f8fb;
        height: fit-content;
        justify-content: space-between;
      `}
    >
      {children}
    </ContentHeader>
);

export default PageHeader;