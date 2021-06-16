import { ReactElement, ReactNode } from 'react';
import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const HelpBubble = ({
  tail,
  text,
  width = '100%',
}: {
  tail?: 'left' | 'right';
  text: ReactNode | ReactElement;
  width?: string;
}): ReactElement => {
  const theme: UikitTheme = useTheme();

  const opposite = tail === 'left' ? 'right' : 'left';

  return (
    <Typography
      as="figure"
      css={css`
        background: ${theme.colors.secondary_4};
        border-radius: 2px;
        box-sizing: border-box;
        font-size: 11px;
        line-height: 14px;
        margin: ${tail ? '0' : '10px'} 0 ${tail ? '10px 10px' : ''};
        padding: 6px 8px;
        position: relative;
        width: ${width};

        &::before {
          border: 5px solid transparent;
          border-bottom: 5px solid transparent;
          ${tail && `border-${opposite}-color: ${theme.colors.secondary_4};`}
          border-top: 5px solid transparent;
          ${tail && 'content: "";'}
          display: block;
          height: 0;
          pointer-events: none;
          position: absolute;
          ${opposite}: 100%;
          top: 5px;
          width: 0;
        }

        ul {
          margin: 3px 0 0;
          padding-left: 15px;
        }

        li:not(:last-of-type) {
          margin: 1px 0;
        }

        span {
          font-size: 11px;
        }
      `}
    >
      {text}
    </Typography>
  );
};

export default HelpBubble;
