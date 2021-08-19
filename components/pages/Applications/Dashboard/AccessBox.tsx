import { css } from '@icgc-argo/uikit';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { styled } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';

const IconWithText = styled('div')`
  min-width: 120px;
  font-size: 11px;
  display: flex;
  flex: 1;
  align-items: center;
  padding: 18px 23px 18px 16px;

  & img {
    margin-right: 7px;
  }
`;

const getConfig = (hasAccess: boolean): { iconName: string; fontColor: string; iconText: string } =>
  hasAccess
    ? {
        iconName: '/icons-checkmark.svg',
        fontColor: 'accent1_dark',
        iconText: 'ICGC DACO Approved!',
      }
    : { iconName: '/icons-controlled-data.svg', fontColor: 'primary', iconText: 'No Access' };

const AccessBox = ({ hasAccess = false }: { hasAccess?: boolean }) => {
  const theme = useTheme();

  const { iconName, iconText, fontColor } = getConfig(hasAccess);

  return (
    <div
      css={css`
        align-self: flex-start;
        border: 1px solid ${theme.colors.grey_2};
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex: 0 0 412px;
      `}
    >
      <IconWithText hasAccess={hasAccess}>
        <img src={iconName} width={40} height={40} />
        <Typography variant="caption" color={fontColor} bold>
          {iconText}
        </Typography>
      </IconWithText>

      <div
        css={css`
          border-left: 1px solid #dcdde1;
          padding: 8px 27px 8px 16px;
          margin: 8px 0;
        `}
      >
        <Typography
          as="span"
          css={css`
            line-height: 1.69;
            font-size: 13px;
          `}
        >
          {hasAccess
            ? 'You have access to ICGC Controlled Data.'
            : 'You do not have access to ICGC Controlled Data.'}
        </Typography>
      </div>
    </div>
  );
};

export default AccessBox;
