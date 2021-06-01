import { ReactElement } from 'react';
import Icon from '@icgc-argo/uikit/Icon';
import { css, UikitTheme } from '@icgc-argo/uikit/index';
import Tag from '@icgc-argo/uikit/Tag';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import { FormSectionOverallState, getValidationUIConfig } from './helpers';

const ValidationIcon = ({ status }: { status: FormSectionOverallState }): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { iconName, tagVariant } = getValidationUIConfig(status);

  return (
    <Tag
      css={css`
        align-items: center;
        border-radius: 50%;
        display: flex;
        height: 22px;
        justify-content: center;
        padding: 0;
        width: 22px;
      `}
      variant={tagVariant}
    >
      <Icon fill={theme.colors.white} height="12px" name={iconName} />
    </Tag>
  );
};

export default ValidationIcon;
