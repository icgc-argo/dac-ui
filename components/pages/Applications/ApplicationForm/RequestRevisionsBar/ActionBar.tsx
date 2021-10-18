import css from '@emotion/css';
import { ContentHeader } from '@icgc-argo/uikit/PageLayout';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import React from 'react';

const ActionBar = ({ children }) => {
  const theme = useTheme();

  return (
    <ContentHeader
      css={css`
        border: 1px solid black;
        height: auto;
        line-height: 1;
        margin-bottom: -16px;
        margin-top: 16px;
      `}
    >
      <div
        css={css`
          align-items: center;
          background: ${theme.colors.warning_3};
          border-radius: 8px;
          box-sizing: border-box;
          display: flex;
          height: auto;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          min-width: 665px;
          padding: 8px 10px 8px 16px;
          width: 100%;
        `}
      >
        <div>{/* Expiry placeholder */}</div>
        <div
          css={css`
            display: flex;
            > button {
              margin-right: 8px;
              &:last-child {
                margin-right: 0;
              }
            }
          `}
        >
          {children}
        </div>
      </div>
    </ContentHeader>
  );
};

export default ActionBar;
