import AppBar, { Logo, MenuGroup, MenuItem, NavBarElement, Section } from '@icgc-argo/uikit/AppBar';
import Button from '@icgc-argo/uikit/Button';
import Typography from '@icgc-argo/uikit/Typography';
import { css, styled, UikitTheme } from '@icgc-argo/uikit/index';
import {
  CONTACT_PAGE,
  CONTROLLED_DATA_USERS_PAGE,
  HELP_PAGE,
  POLICIES_PAGE,
} from 'global/constants/externalPaths';
import Link from '@icgc-argo/uikit/Link';

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

const NavBar = () => {
  return (
    <AppBar
      css={(theme: UikitTheme) =>
        css`
          background-color: ${theme.colors.white};
          border: none;
          display: flex;
          justify-content: space-between;
          box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
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
            <Button
              css={(theme: UikitTheme) =>
                css`
                  background-color: ${theme.colors.accent2};
                  border: 1px solid ${theme.colors.accent2};
                `
              }
            >
              Login
            </Button>
          </StyledMenuItem>
        </MenuGroup>
      </Section>
    </AppBar>
  );
};

export default NavBar;
