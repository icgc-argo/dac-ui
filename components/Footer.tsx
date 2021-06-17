import React from 'react';
import { css } from '@icgc-argo/uikit';
import { styled, UikitTheme } from '@icgc-argo/uikit/index';
import Link from '@icgc-argo/uikit/Link';
import {
  CONTACT_PAGE,
  CONTROLLED_DATA_USERS_PAGE,
  GLASGOW_UNI_LINK,
  HELP_PAGE,
  OICR_LINK,
  POLICIES_PAGE,
  PRIVACY_POLICY_PAGE,
  PUBLICATION_POLICY_PAGE,
  TERMS_PAGE,
} from 'global/constants/externalPaths';
import { LinkProps } from './NavBar';
import { getConfig } from 'global/config';
import { useHealthAPI } from 'global/hooks';

const { NEXT_PUBLIC_ARGO_ROOT, NEXT_PUBLIC_ARGO_PLATFORM_ROOT } = getConfig();

const StyledLink = styled(Link)`
  ${({ theme }: { theme: UikitTheme }) => css`
    ${theme.typography.data};
    margin: 0px 5px;
  `}
`;

const StyledPolicyLink = styled(StyledLink)`
  ${({ theme }: { theme: UikitTheme }) => css`
    ${theme.typography.caption};
  `}
`;

const footerLinks: LinkProps[] = [
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
  {
    title: 'ICGC ARGO Website',
    href: NEXT_PUBLIC_ARGO_ROOT,
  },
  {
    title: 'ARGO Data Platform',
    href: NEXT_PUBLIC_ARGO_PLATFORM_ROOT,
  },
];

const policyLinks: LinkProps[] = [
  {
    title: 'Privacy Policy',
    href: PRIVACY_POLICY_PAGE,
  },
  {
    title: 'Terms & Conditions',
    href: TERMS_PAGE,
  },
  {
    title: 'Publication Policy',
    href: PUBLICATION_POLICY_PAGE,
  },
];

const showBreak = (i: number, total: number) => {
  return (
    i < total - 1 && (
      <span
        css={(theme: UikitTheme) =>
          css`
            color: ${theme.colors.grey_1};
            font-weight: 900;
            vertical-align: middle;
          `
        }
      >
        /
      </span>
    )
  );
};

const LinksSection = () => {
  const { NEXT_PUBLIC_APP_VERSION } = getConfig();
  const { error, isLoading, response } = useHealthAPI();
  const apiVersion = !error && !isLoading && response && response.data.version;

  return (
    <div
      css={css`
        margin: 0 0.5rem;
      `}
    >
      <div>
        {footerLinks.map((link, i) => (
          <span key={`${link.title}-${i}`}>
            <StyledLink href={link.href} target={link.target || '_blank'}>
              {link.title}
            </StyledLink>
            {showBreak(i, footerLinks.length)}
          </span>
        ))}
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        `}
      >
        <div
          css={(theme: UikitTheme) => css`
            ${theme.typography.caption};
          `}
        >
          © 2021 ICGC Data Access Compliance Office. All rights reserved.
        </div>
        <div
          css={css`
            align-items: center;
            justify-content: center;
          `}
        >
          {policyLinks.map((link: LinkProps, i) => (
            <span key={`${link.title}-${i}`}>
              <StyledPolicyLink href={link.href} target={link.target || '_blank'}>
                {link.title}
              </StyledPolicyLink>
              {showBreak(i, policyLinks.length)}
            </span>
          ))}
        </div>
        <div
          css={(theme: UikitTheme) => css`
            ${theme.typography.caption};
          `}
        >
          UI v{NEXT_PUBLIC_APP_VERSION}{apiVersion && ` - API v${apiVersion}`}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer>
      <div
        css={(theme: UikitTheme) => css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          background: ${theme.colors.grey_4};
          padding: 24px;
          border-top: 1px solid ${theme.colors.grey_2};
        `}
      >
        <Link href={NEXT_PUBLIC_ARGO_ROOT} target="_blank">
          <img src={'/argo-full-logo.svg'} />
        </Link>
        <LinksSection />
        <div
          css={css`
            display: flex;
            flex-direction: row;
            height: 100%;
            align-items: center;
          `}
        >
          <Link
            css={css`
              margin-right: 1rem;
            `}
            href={GLASGOW_UNI_LINK}
            target="_blank"
          >
            <img src={'/glasgow-university-logo.png'} width={'122px'} height={'38px'} />
          </Link>
          <Link href={OICR_LINK} target="_blank">
            <img src={'/oicr-logo.svg'} width={'72px'} height={'52px'} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
