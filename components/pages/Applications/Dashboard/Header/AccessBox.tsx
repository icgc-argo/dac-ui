import { css } from '@icgc-argo/uikit';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Icon from '@icgc-argo/uikit/Icon';
import { styled } from '@icgc-argo/uikit';
import Link from '@icgc-argo/uikit/Link';
import Image from 'next/image';
import Typography from '@icgc-argo/uikit/Typography';

const IconWithText = styled('div')`
  font-size: 11px;
  display: flex;
  align-items: center;
  padding: 18px 23px 18px 16px;

  & img {
    margin-right: 7px;
  }
`;

const getConfig = (hasAccess: boolean): { iconName: string; iconFill: string; iconText: string } =>
  hasAccess
    ? { iconName: '/icons-success.svg', iconFill: 'white', iconText: 'ICGC DACO Approved!' }
    : { iconName: '/icons-controlled-data.svg', iconFill: 'accent2', iconText: 'No Access' };

const AccessBox = ({ hasAccess = false }: { hasAccess?: boolean }) => {
  const theme = useTheme();

  const { iconName, iconFill, iconText } = getConfig(hasAccess);

  return (
    <div
      css={css`
        align-self: flex-start;
        border: 1px solid ${theme.colors.grey_2};
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex: 0 0 379px;
      `}
    >
      <IconWithText hasAccess={hasAccess}>
        <img src={iconName} width={40} height={40} />
        <Typography variant="caption">{iconText}</Typography>
      </IconWithText>
      <div
        css={css`
          border-left: 1px solid #dcdde1;
          padding: 8px 27px 8px 16px;
          margin: 8px 0;
        `}
      >
        <Typography
          css={css`
            line-height: 1.69;
            font-size: 13px;
          `}
        >
          {hasAccess ? (
            <>
              You have access to <Link>ICGC Controlled Data »</Link>
            </>
          ) : (
            'You do not have access to ICGC Controlled Data.'
          )}
        </Typography>
      </div>
    </div>
  );
};

export default AccessBox;
