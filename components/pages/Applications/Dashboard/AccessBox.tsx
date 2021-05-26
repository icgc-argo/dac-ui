import { css } from '@icgc-argo/uikit';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Icon from '@icgc-argo/uikit/Icon';
import { styled } from '@icgc-argo/uikit';
import Link from '@icgc-argo/uikit/Link';
import Image from 'next/image';

const IconWithText = styled('div')``;

//const getConfig = (hasAccess: boolean): {iconName: string} => (hasAccess ? {} : {});

const AccessBox = ({ hasAccess = false }: { hasAccess?: boolean }) => {
  const theme = useTheme();
  const iconName = hasAccess ? 'success' : 'dna_locked';
  const iconFill = hasAccess ? 'white' : 'accent2';

  // const config = getConfig(hasAccess);

  return (
    <div
      css={css`
        border: 1px solid ${theme.colors.grey_2};
        border-radius: 8px;
        padding: 18px 16px;
        display: flex;
        align-items: center;
      `}
    >
      <IconWithText hasAccess={hasAccess}>
        <Image src="/icons/controlled_data.svg" width={40} height={40} />
        <div> {hasAccess ? 'ICGC DACO Approved!' : 'No Access'}</div>
      </IconWithText>

      <div>
        {hasAccess ? (
          <div>
            You have access to <Link>ICGC Controlled Data »</Link>
          </div>
        ) : (
          'You do not have access to ICGC Controlled Data.'
        )}
      </div>
    </div>
  );
};

export default AccessBox;
