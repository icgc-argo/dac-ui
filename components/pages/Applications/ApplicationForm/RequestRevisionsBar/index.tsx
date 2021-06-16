import { useState } from "react";
import { css } from '@emotion/core';

import { ContentHeader } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';

import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { ModalPortal } from 'components/Root';

import RequestRevisionsModal from "./RequestRevisionsModal";

const RequestRevisionsBar = ({ appId }: { appId: string }) => {
  const theme = useTheme();
  const [isRequestRevisionsModalVisible, setRequestRevisionsModalVisible] = useState(true);

  return (
    <>
      {isRequestRevisionsModalVisible && (
        <ModalPortal>
          <RequestRevisionsModal
            dismissModal={() => setRequestRevisionsModalVisible(false)}
          />
        </ModalPortal>
      )}
      <ContentHeader css={css`
        border: 0 none;
        height: auto;
        line-height: 1;
        margin-bottom: -16px;
        margin-top: 16px;
      `}>
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
                  css={css`
                    margin-right: 1px;
                    margin-left: -4px;
                  `}
                  fill={theme.colors.white}
                  height="12px"
                  name="checkmark"
                />
                Approve
              </span>
            </Button>
            <Button
              onClick={() => {
                setRequestRevisionsModalVisible(true);
              }}
              size="sm"
            >
              <span css={instructionBoxButtonContentStyle}>
                <Icon
                  css={instructionBoxButtonIconStyle}
                  fill={theme.colors.white}
                  height="9px"
                  name="edit"
                />
                Request Revisions
              </span>
            </Button>
            <Button size="sm">
              <span css={instructionBoxButtonContentStyle}>
                <Icon
                  css={instructionBoxButtonIconStyle}
                  fill={theme.colors.white}
                  height="10px"
                  name="times"
                />
                Reject
              </span>
            </Button>
          </div>
        </div>
      </ContentHeader>
    </>
  );
};

export default RequestRevisionsBar;