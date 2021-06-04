import { ReactElement } from 'react';
import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const HeaderActions = (): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <section
      css={css`
        display: flex;

        *:not(:last-of-type) {
          margin-right: 5px;
        }
      `}
    >
      <Button onClick={function noRefCheck() {}} size="sm" variant="secondary">
        Close Application
      </Button>

      <Button onClick={function noRefCheck() {}} size="sm" variant="secondary">
        <Icon
          css={css`
            margin-bottom: -2px;
          `}
          fill={theme.colors.accent2_dark}
          height="12px"
          name="download"
        />{' '}
        Draft PDF
      </Button>
    </section>
  );
};

export default HeaderActions;
