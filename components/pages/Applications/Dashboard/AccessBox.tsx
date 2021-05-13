import { css } from '@icgc-argo/uikit';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Icon from '@icgc-argo/uikit/Icon';
import { styled } from '@icgc-argo/uikit';

/* const hasAccessMessage = (
  <div>
    You have access to <a href="">ICGC Controlled Data »</a>
  </div>
);
const noAccessMessage = 'You do not have access to ICGC Controlled Data.';
 */

const IconWithText = styled('div')`
  color: ${({ theme }: { theme: any }) => theme.colors.accent1_dark};
  svg {
    margin-right: 7px;
    display: inline-block;
    vertical-align: middle;
  }
`;

const AccessBox = ({ hasAccess = false }: { hasAccess?: boolean }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        border: 1px solid ${theme.colors.grey_2};
        border-radius: 8px;
        padding: 8px;
      `}
    >
      <IconWithText>
        <Icon name="success" width="40px" height="40px" fill="accent1_dimmed" />
        ICGC DACO Approved!
      </IconWithText>
      <div
        css={css`
          height: 10px;
          width: 0;
          border: 1px solid grey;
        `}
      />
      <div>You have access to ICGC Controlled Data »</div>
    </div>
  );
};

export default AccessBox;
