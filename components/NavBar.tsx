import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import urlJoin from 'url-join';
import { get } from 'lodash';
import queryString from 'query-string';

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
  ADMIN_APPLICATIONS_LABEL,
  APPLICANT_APPLICATIONS_LABEL,
  APPLICATIONS_PATH,
  CONTROLLED_DATA_USERS_PAGE,
  EGO_LOGIN_URL,
  HELP_PAGE,
  POLICIES_PAGE,
} from 'global/constants';
import { useAuthContext, usePageContext } from 'global/hooks';
import { UserWithId } from 'global/types';
import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import { createLoginRedirectURL } from 'global/utils/authUtils';
import ApplyForAccessModal from 'components/ApplyForAccessModal';

const StyledMenuItem = styled(MenuItem)`
  ${({ theme }: { theme: UikitTheme }) => `
    border: none;
    color: ${theme.colors.black};
    &:hover {
      background-color: ${theme.colors.grey_4};
      color: ${theme.colors.secondary};
    }
    > span {
      font-size: 14px;
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
  const { asPath: path = '', query } = usePageContext();
  const [loginPath, setLoginPath] = useState(EGO_LOGIN_URL);
  const router = useRouter();

  useEffect(() => {
    const redirect = get(query, 'redirect') as string;
    if (redirect) {
      const parsedRedirect = queryString.parseUrl(redirect);
      const existingQuery = queryString.stringify(parsedRedirect.query);

      const queryRedirect = createLoginRedirectURL({
        origin: location.origin,
        path: parsedRedirect.url,
        query: existingQuery,
      });
      setLoginPath(urlJoin(EGO_LOGIN_URL, queryRedirect));
    } else if (path === '/') {
      setLoginPath(EGO_LOGIN_URL);
    } else {
      const queryString = path.split('?')[1] || '';
      const pathRoot = path.split('?')[0];

      const redirect = createLoginRedirectURL({
        origin: location.origin,
        path: pathRoot,
        query: queryString,
      });
      setLoginPath(urlJoin(EGO_LOGIN_URL, redirect));
    }
  }, [path, query]);

  return (
    <Button
      onClick={() => router.push(loginPath)}
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

const NavBar = ({ hideLinks }: { hideLinks?: boolean }) => {
  const { user, logout, permissions } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = createRef() as React.RefObject<HTMLDivElement>;
  const [isAccessModalVisible, setAccessModalVisible] = useState<boolean>(false);

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
          ) : hideLinks ? null : (
            <Link
              css={css`
                text-decoration: none;
              `}
              onClick={() => setAccessModalVisible(true)}
            >
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
            </Link>
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
          ) : hideLinks ? null : (
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
      {isAccessModalVisible && (
        <ApplyForAccessModal dismissModal={() => setAccessModalVisible(false)} />
      )}
    </AppBar>
  );
};

export default NavBar;
