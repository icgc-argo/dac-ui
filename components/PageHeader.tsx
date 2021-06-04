import { ReactElement } from 'react';
import { css } from '@emotion/core';
import { ContentHeader } from '@icgc-argo/uikit/PageLayout';
import Typography from '@icgc-argo/uikit/Typography';
import { Container } from 'react-grid-system';

const PageHeader = ({ children }: { children: ReactElement | string }): ReactElement => (
  <ContentHeader
    css={css`
      background: #f8f8fb;
      height: fit-content;
      justify-content: space-between;
    `}
  >
    {typeof children === 'string'
      ? (
        <Container
          css={css`
            width: 100%;
          `}>
          <Typography
            component="h1"
            css={css`
              font-size: 24px;
              line-height: 28px;
              margin: 15px 0 13px;
              text-align: left;
            `}
          >
            {children}
          </Typography>
        </Container>
      )
      : children}
  </ContentHeader>
);

export default PageHeader;
