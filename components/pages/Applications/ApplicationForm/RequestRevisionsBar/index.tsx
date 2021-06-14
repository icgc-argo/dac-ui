import React from "react";
import { css } from '@emotion/core';

import { ContentHeader } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';

import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';

const RequestRevisionsBar = ({ appId }: { appId: string }) => {
  const theme = useTheme();
  return (
    <ContentHeader css={css`
      border: 0 none;
      line-height: 1;
      height: auto;
      margin-top: 16px;
      margin-bottom: -16px;
    `}>
      <div
        css={css`
          align-items: center;
          background: ${theme.colors.warning_3};
          border-radius: 8px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          min-width: 665px;
          padding: 8px 10px 8px 16px;
          width: 100%;
          margin: 0 auto;
          line-height: 1;
          height: auto;
        `}
      >
        <div>
          Expiry placeholder
        </div>
        <div css={css`
          display: flex;
          > button {
            margin-right: 8px;
            &:last-child {
              margin-right: 0;
            }
          }
        `}>
          <Button size="sm">
            <span css={instructionBoxButtonContentStyle}>
              <Icon
                fill={theme.colors.white}
                height="12px"
                name="checkmark"
                css={css`
                  margin-right: 1px;
                  margin-left: -4px;
                `}
              />
              Approve
            </span>
          </Button>
          <Button size="sm">
            <span css={instructionBoxButtonContentStyle}>
              <Icon
                fill={theme.colors.white}
                height="9px"
                name="edit"
                css={instructionBoxButtonIconStyle}
              />
              Request Revisions
            </span>
          </Button>
          <Button size="sm">
            <span css={instructionBoxButtonContentStyle}>
              <Icon
                fill={theme.colors.white}
                height="10px"
                name="times"
                css={instructionBoxButtonIconStyle}
              />
              Reject
            </span>
          </Button>
        </div>
      </div>
    </ContentHeader>
  );
};

export default RequestRevisionsBar;