import { ReactElement } from 'react';
import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const RequiredStar = (): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <Icon
      css={css`
        margin-bottom: 5px;
      `}
      width="6px"
      height="6px"
      name="asterisk"
      fill={theme.colors.error}
    />
  );
};

export default RequiredStar;
