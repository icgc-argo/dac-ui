import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import urlJoin from 'url-join';
import AppBar, {
  DropdownMenu,
  Logo,
  MenuGroup,
  MenuItem,
  Section,
  NavBarElement,
} from '@icgc-argo/uikit/AppBar';
import Button from '@icgc-argo/uikit/Button';
import Typography from '@icgc-argo/uikit/Typography';
import { css, styled, UikitTheme } from '@icgc-argo/uikit/index';
import Link from '@icgc-argo/uikit/Link';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import useClickAway from '@icgc-argo/uikit/utils/useClickAway';

import {
  CONTROLLED_DATA_USERS_PAGE,
  HELP_PAGE,
  POLICIES_PAGE,
} from 'global/constants/externalPaths';
import { APPLICATIONS_PATH, LOGGED_IN_PATH } from 'global/constants/internalPaths';
import { getConfig } from 'global/config';
import { useAuthContext } from 'global/hooks';
import { UserWithId } from 'global/types';
import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import { ADMIN_APPLICATIONS_LABEL, APPLICANT_APPLICATIONS_LABEL } from 'global/constants';

const StyledMenuItem = styled(MenuItem)`
  ${({ theme }: { theme: UikitTheme }) => `
    border: none;
    color: ${theme.colors.black};
    &:hover {
      background-color: ${theme.colors.grey_4};
      color: ${theme.colors.secondary};
    }
  `}
`;

export type LinkProps = { title: string; href: string; target?: string };
const navBarLinks: LinkProps[] = [
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

const UserDisplayName = ({ user, dropdownOpen }: { user: UserWithId; dropdownOpen: boolean }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={(theme: UikitTheme) => css`
          background-color: ${theme.colors.secondary};
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0.5rem;
        `}
      >
        <Icon name="user" fill={theme.colors.white} />
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          margin-right: 0.5rem;
          align-items: flex-start;
        `}
      >
        <Typography
          variant="data"
          css={css`
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 2px;
          `}
        >
          Hello, {user.firstName}
        </Typography>
        {user.email && (
          <Typography
            css={css`
              max-width: 125px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
            variant="data"
          >
            <span>{user.email}</span>
          </Typography>
        )}
      </div>

      {dropdownOpen ? <Icon name="chevron_up" /> : <Icon name="chevron_down" />}
    </div>
  );
};

const LoginButton = () => {
  const router = useRouter();
  const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
  const egoLoginUrl = new URL(urlJoin(NEXT_PUBLIC_EGO_API_ROOT, 'oauth/login/google'));
  egoLoginUrl.searchParams.append('client_id', NEXT_PUBLIC_EGO_CLIENT_ID);
  const [loginUrl, setLoginUrl] = useState<string>(egoLoginUrl.href);

  useEffect(() => {
    const redirectPath = router.query?.redirect || '';
    const redirectString = typeof redirectPath === 'string' ? redirectPath : redirectPath[0];
    const redirect_uri = urlJoin(
      location.origin,
      `${LOGGED_IN_PATH}%3Fredirect%3D${encodeURIComponent(redirectString)}`
    );
    const egoUrl = urlJoin(
      egoLoginUrl.href,
      redirectString ? `&redirect_uri=${redirect_uri}` : ''
    );
    setLoginUrl(egoUrl);
    console.log('🗺 redirect_uri', redirect_uri);
    console.log('🗺 egoUrl', egoUrl);
  }, [router.asPath]);

  return (
    <Button
      onClick={() => router.push(loginUrl)}
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
  const { user, logout, permissions } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = createRef() as React.RefObject<HTMLDivElement>;

  useClickAway({
    domElementRef: dropdownRef,
    onClickAway: () => setDropdownOpen(false),
    onElementClick: () => setDropdownOpen(!dropdownOpen),
  });

  const applicationsTitle = isDacoAdmin(permissions)
    ? ADMIN_APPLICATIONS_LABEL
    : APPLICANT_APPLICATIONS_LABEL;

  return (
    <AppBar
      css={(theme: UikitTheme) =>
        css`
          background-color: ${theme.colors.white};
          border: none;
          display: flex;
          justify-content: space-between;
          box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
          z-index: 1;
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
              <img src="/icgc-daco-logo.svg" alt="ICGC DACO Home" width="208" />
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
          {user ? (
            <Link
              // TODO should be a next link
              css={css`
                text-decoration: none;
              `}
              href={APPLICATIONS_PATH}
            >
              <StyledMenuItem
                css={(theme: UikitTheme) =>
                  css`
                  color: ${theme.colors.secondary};
                  border-left: 1px solid ${theme.colors.grey_2};
                  border-right: 1px solid ${theme.colors.grey_2};
                  border-bottom: 3px solid ${theme.colors.secondary};
                `
                }
              >
                {applicationsTitle}
              </StyledMenuItem>
            </Link>
          ) : (
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
          )}
          {user ? (
            <StyledMenuItem
              css={(theme: UikitTheme) =>
                css`
                  &:hover {
                    background-color: ${theme.colors.grey_4};
                    svg {
                      fill: ${theme.colors.secondary};
                    }
                  }
                `
              }
              ref={dropdownRef}
              dropdownMenu={
                <DropdownMenu>
                  <NavBarElement
                    active={false}
                    name={'Log out'}
                    href={''}
                    isDropdown={true}
                    isLink={false}
                    LinkComp={() => <div />}
                    onClick={() => logout()}
                  />
                </DropdownMenu>
              }
            >
              <UserDisplayName dropdownOpen={dropdownOpen} user={user} />
            </StyledMenuItem>
          ) : (
            <StyledMenuItem
              css={(theme: UikitTheme) => css`
                cursor: auto;
                &:hover {
                  background-color: ${theme.colors.white};
                }
              `}
            >
              <LoginButton />
            </StyledMenuItem>
          )}
        </MenuGroup>
      </Section>
    </AppBar>
  );
};

export default NavBar;
