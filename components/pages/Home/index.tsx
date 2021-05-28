import { css, styled } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import Button from '@icgc-argo/uikit/Button';
import Link from '@icgc-argo/uikit/Link';

import { Col, Row } from 'react-grid-system';

import DefaultPageLayout from 'components/DefaultPageLayout';
import { ARGO_ROOT, ICGC_DCC_LINK, ICGC_PCAWG_LINK } from 'global/constants/externalPaths';

import heroBackground from 'static/home-hero-bg.jpeg';
import icgcArgoLogo from 'static/icgc-argo-logo-white.svg';
import icgcLogo from 'static/icgc-logo-rgb-divided.svg';
import iconApply from 'static/icons-brand-apply.svg';
import iconSign from 'static/icons-brand-sign.svg';
import iconReview from 'static/icons-brand-review.svg';

const LinkWhite = ({ children, href }: { children: any, href: string }) => (
  <Link href={href} style={{ color: '#fff' }} target="_blank">{children}</Link>
);

const LogoParagraphRow = ({ children, Img, imageLink }: { children: any, Img: any, imageLink: string }) => (
  <div
    css={css`
      display: flex;
      margin-bottom: 24px;
      width: 100%;
    `}
  >
    <div
      css={css`
        flex: 0 0 170px;
      `}
    >
      <Link
        href={imageLink}
        target="_blank"
      >
        {Img}
      </Link>
    </div>
    <div
      css={css`
        flex: 1;
      `}
    >
      <Typography
        as="p"
        bold={true}
        color="white"
        css={css`
          margin: 0;
        `}
        variant="paragraph2"
      >
        {children}
      </Typography>
    </div>
  </div>
);

const ParagraphBlack = ({ bold = false, children, marginBottom = 0 }: { bold?: boolean, children: any, marginBottom?: number }) => (
  <Typography
    as="p"
    bold={bold}
    css={css`
      margin-top: 0;
    `}
    variant="paragraph2"
  >
    {children}
  </Typography>
);

const IconParagraphRow = ({ children, img }: { children: any, img: string }) => (
  <div
    css={css`
      display: flex;
      margin-bottom: 16px;
      width: 100%;
      align-items: center;
    `}
  >
    <div
      css={css`
        flex: 0 0 64px;
      `}
    >
      <img src={img} width={50} height={50} />
    </div>
    <div
      css={css`
        flex: 1;
      `}
    >
      <Typography
        as="p"
        css={css`
          margin: 0;
        `}
        variant="paragraph2"
      >
        {children}
      </Typography>
    </div>
  </div>
);

const PaddedRow = ({ children }: { children: any }) => (
  <Row
    css={css`
      padding: 72px 5% 48px;
    `}
  >
    {children}
  </Row>
);

const PaddedColumn = ({ children }: { children: any }) => (
  <Col
    css={css`
      padding: 0 3% !important;
    `}
  >
    {children}
  </Col>
);

const PrimaryH2 = ({ children }: { children: any }) => (
  <Typography
    as="h2"
    variant="subtitle"
    color="primary"
    css={css`
      margin: 0 0 20px;
    `}
  >
    {children}
  </Typography>
);

const HeroDiv = styled('div')`
  background-image: ${({ theme }: { theme: any }) =>
    `linear-gradient(to bottom, 
      ${theme.colors.primary}, 
      ${theme.colors.accent2}00 105%),
      url(${heroBackground});`};
  background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;
  width: calc(100% - 30px);
`;

const Home = () => {
  return (
    <DefaultPageLayout title={'Homepage'}>
      <HeroDiv>
        <PaddedRow>
          <PaddedColumn>
            <Typography
              as="h1"
              bold={true}
              color="white"
              css={css`
                margin: 0 0 21px;
                font-size: 30px;
              `}
              variant="hero"
            >
              Apply for Access to Controlled Data
          </Typography>
            <Typography
              bold={true}
              color="white"
              css={css`
              line-height: 24px;
            `}
              variant="subtitle2"
            >
              The ICGC Data Access Compliance Office (ICGC DACO) handles requests from scientists, researchers and commercial teams for access to ICGC Controlled Data.
          </Typography>
          <Button
            css={css`
              margin-bottom: 24px;
            `}
            size="md"
            variant="secondary"
          >
            Get Started: Apply for Access
          </Button>
          </PaddedColumn>
          <PaddedColumn>
            <Typography
              as="h1"
              bold={true}
              color="white"
              css={css`
                margin: 0 0 30px;
              `}
              variant="subtitle2"
            >
              What will you get access to?
            </Typography>
            <LogoParagraphRow
              Img={<img src={icgcArgoLogo} width={'145px'} height={'23px'} />}
              imageLink={ARGO_ROOT}
            >
              <LinkWhite href={ARGO_ROOT}>ICGC ARGO</LinkWhite> plans to uniformly analyze specimens from 100,000 cancer patients with high quality clinical data.
            </LogoParagraphRow>
            <LogoParagraphRow
              Img={<img src={icgcLogo} width={'140px'} height={'46px'} />}
              imageLink={ICGC_DCC_LINK}
            >
              <LinkWhite href={ICGC_DCC_LINK}>ICGC 25K Data Portal</LinkWhite> to date has produced &gt;20,000 tumour genomes for 26 cancer types (including <LinkWhite href={ICGC_PCAWG_LINK}>PCAWG</LinkWhite> data).
            </LogoParagraphRow>
          </PaddedColumn>
        </PaddedRow>
      </HeroDiv>
      <div
        css={css`
          padding: 0 15px;
          width: calc(100% - 30px);
        `}
      >
        <PaddedRow>
          <PaddedColumn>
            <PrimaryH2>
              Overview
            </PrimaryH2>
            <ParagraphBlack>
              While there is great potential of data sharing for scientific research, caution is required when sharing data about individuals participating in genomic research because genomic data, like other types of medical data, can contain personal and identifying information. The ICGC DACO has been created to ensure that potentially identifying data from the ICGC will only be used by qualified scientists for public health objectives.
            </ParagraphBlack>
            <ParagraphBlack bold>
              Before starting your application, please review our <Link href="TODO">frequently asked questions</Link>.
            </ParagraphBlack>
          </PaddedColumn>
          <PaddedColumn>
            <PrimaryH2>
              The Application Process is Simple
            </PrimaryH2>
            <IconParagraphRow img={iconApply}>
              Log in and start an application. Carefully complete all required sections and review all policies and agreements.
            </IconParagraphRow>
            <IconParagraphRow img={iconSign}>
              When completed, obtain the required signatures and submit the signed application for review.
            </IconParagraphRow>
            <IconParagraphRow img={iconReview}>
              The ICGC DACO will review the application and <Link href="TODO">eligible project teams</Link> will be granted 1 year of access to ICGC Controlled Data.
            </IconParagraphRow>
          </PaddedColumn>
        </PaddedRow>
      </div>
    </DefaultPageLayout>
  );
};

export default Home;
