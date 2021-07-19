import { ReactElement } from 'react';
import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import Icon from '@icgc-argo/uikit/Icon';
import Typography from '@icgc-argo/uikit/Typography';

const NoFilesMessage = ({ fileType = 'files' }: { fileType: string }): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <figure
      css={css`
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0;
        padding: 10px 0 40px;

        svg {
          margin-bottom: 15px;
        }

        p {
          color: ${theme.colors.grey};
          font-size: 12px;
          margin-bottom: 3px !important;
        }
      `}
    >
      <Icon fill={theme.colors.grey_1} name="file" height="30px" width="30px" />

      <Typography bold>{`You have not added any ${fileType}.`}</Typography>

      <Typography>To get started, click the “Upload a File” button above.</Typography>
    </figure>
  );
};

export default NoFilesMessage;
