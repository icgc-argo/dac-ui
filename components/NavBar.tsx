import { useRouter } from 'next/router';
import urlJoin from 'url-join';
import AppBar, { Logo, MenuGroup, MenuItem, Section } from '@icgc-argo/uikit/AppBar';
import Button from '@icgc-argo/uikit/Button';
import Typography from '@icgc-argo/uikit/Typography';
import { css, styled, UikitTheme } from '@icgc-argo/uikit/index';
import Link from '@icgc-argo/uikit/Link';
import Icon from '@icgc-argo/uikit/Icon';

import {
  CONTACT_PAGE,
  CONTROLLED_DATA_USERS_PAGE,
  HELP_PAGE,
  POLICIES_PAGE,
} from 'global/constants/externalPaths';
import { getConfig } from 'global/config';

const StyledMenuItem = styled(MenuItem)`
  ${({ theme }: { theme: UikitTheme }) => `
    border: none;
    color: ${theme.colors.black};
    &:hover {
      background-color: ${theme.colors.grey_3};
      color: ${theme.colors.black};
    }
  `}
`;

export type LinkProps = { title: string; href: string; target?: string };
const navBarLinks: LinkProps[] = [
  {
    title: 'Contact Us',
    href: CONTACT_PAGE,
  },
  {
    title: 'Policies & Guidelines',
    href: POLICIES_PAGE,
  },
  {
    title: 'Help Guides',
    href: HELP_PAGE,
  },
  {
    title: 'Controlled Data Users',
    href: CONTROLLED_DATA_USERS_PAGE,
  },
];

const LoginButton = () => {
  const router = useRouter();
  const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
  const egoLoginUrl = new URL(urlJoin(NEXT_PUBLIC_EGO_API_ROOT, 'oauth/login/google'));
  egoLoginUrl.searchParams.append('client_id', NEXT_PUBLIC_EGO_CLIENT_ID);
  return (
    <Button
      onClick={(e) => router.push(egoLoginUrl.href)}
      css={(theme: UikitTheme) =>
        css`
          background-color: ${theme.colors.accent2};
          border: 1px solid ${theme.colors.accent2};
        `
      }
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <Icon width="14px" height="14px" name="google" fill="none" />
        <span
          css={css`
            padding-left: 8px;
          `}
        >
          Login
        </span>
      </div>
    </Button>
  );
};

const NavBar = () => {
  return (
    <AppBar
      css={(theme: UikitTheme) =>
        css`
          background-color: ${theme.colors.white};
          border: none;
          display: flex;
          justify-content: space-between;
        `
      }
    >
      <Section>
        <Logo
          DomComponent={() => (
            <Link
              href={'/'}
              css={css`
                padding: 5px 20px;
                display: flex;
                align-items: center;
              `}
            >
              <img src="/icgc-daco-logo.svg" alt="ICGC DACO Home" />
            </Link>
          )}
        />
        <MenuGroup>
          {navBarLinks.map((link, i) => (
            <Link
              key={`${link.title}-${i}`}
              css={css`
                text-decoration: none;
              `}
              href={link.href}
              target={link.target || '_blank'}
            >
              <StyledMenuItem key={`${link.title}-${i}`}>{link.title}</StyledMenuItem>
            </Link>
          ))}
        </MenuGroup>
      </Section>
      <Section>
        <MenuGroup>
          <StyledMenuItem>
            <Typography
              css={(theme) => css`
                ${theme.typography.data};
                text-transform: uppercase;
                font-weight: bold;
                color: ${theme.colors.accent2_dark};
              `}
            >
              Apply for Access
            </Typography>
          </StyledMenuItem>
          <StyledMenuItem
            css={(theme: UikitTheme) =>
              css`
                &:hover {
                  background-color: ${theme.colors.white};
                }
              `
            }
          >
            <LoginButton />
          </StyledMenuItem>
        </MenuGroup>
      </Section>
    </AppBar>
  );
};

export default NavBar;
