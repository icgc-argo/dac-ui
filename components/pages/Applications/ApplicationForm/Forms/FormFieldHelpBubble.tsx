import { ReactElement } from 'react';
import { css, UikitTheme } from '@icgc-argo/uikit/index';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const HelpBubble = ({ tail, text }: { tail?: 'left' | 'right'; text: string }): ReactElement => {
  const theme: UikitTheme = useTheme();

  const opposite = tail === 'left' ? 'right' : 'left';

  return (
    <Typography
      as="figure"
      className="helpText"
      css={css`
        background: ${theme.colors.secondary_4};
        border-radius: 2px;
        box-sizing: border-box;
        font-size: 11px;
        line-height: 14px;
        margin: 0 0 10px 10px;
        padding: 5px 8px;
        position: relative;
        width: 320px;

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
      `}
    >
      {text}
    </Typography>
  );
};

export default HelpBubble;
