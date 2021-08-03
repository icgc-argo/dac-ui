import { useState } from 'react';
import { css, styled } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import Button from '@icgc-argo/uikit/Button';
import Link from '@icgc-argo/uikit/Link';

import { Col, Row } from 'react-grid-system';

import { PageHead } from 'components/Head';
import { HOMEPAGE_ARGO_LINK, ICGC_DCC_LINK, ICGC_PCAWG_LINK, ICGC_ARGO_FAQS, DACO_APPLYING_DOCS } from 'global/constants/externalPaths';
import { getConfig } from 'global/config';
import ApplyForAccessModal from 'components/ApplyForAccessModal';

const LinkWhite = ({ children, href }: { children: any; href: string }) => (
  <Link href={href} style={{ color: '#fff' }} target="_blank">
    {children}
  </Link>
);

const LogoParagraphRow = ({
  children,
  Img,
  imageLink,
}: {
  children: any;
  Img: any;
  imageLink: string;
}) => (
  <div
    css={css`
      display: flex;
      margin-bottom: 24px;
      width: 100%;
    `}
  >
    <div
      css={css`
        flex: 0 0 240px;
      `}
    >
      <Link href={imageLink} target="_blank">
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

const ParagraphBlack = ({
  bold = false,
  children,
  marginBottom = 0,
}: {
  bold?: boolean;
  children: any;
  marginBottom?: number;
}) => (
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

const IconParagraphRow = ({ children, img }: { children: any; img: string }) => (
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

const PaddedRow = ({ isVerticallyCentered = false, children }: { isVerticallyCentered?: boolean; children: any }) => (
  <Row
    css={css`
      align-items: ${isVerticallyCentered ? 'center !important' : 'normal'};
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
      url("/home-hero-bg.jpeg");`};
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
  const [isAccessModalVisible, setAccessModalVisible] = useState<boolean>(false);
  const { NEXT_PUBLIC_ARGO_PLATFORM_ROOT } = getConfig();
  return (
    <>
      <PageHead title={'Homepage'} />
      <HeroDiv>
        <PaddedRow
          isVerticallyCentered
        >
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
              The ICGC Data Access Compliance Office (ICGC DACO) handles requests from scientists,
              researchers and commercial teams for access to ICGC Controlled Data.
            </Typography>
            <Button
              css={css`
                margin-bottom: 24px;
              `}
              size="md"
              variant="secondary"
              onClick={() => setAccessModalVisible(true)}
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
                margin: 0 0 24px;
              `}
              variant="subtitle2"
            >
              What will you get access to?
            </Typography>
            <Typography
              bold
              color="white"
              css={css`
                margin: 0 0 32px;
              `}
            >
              While all ICGC data sources contain open data, sensitive genomic and clinical data is controlled access data.
            </Typography>
            <LogoParagraphRow
              Img={<img src="/ICGC-ARGO-logo-FULL-white.svg" width={'200px'} />}
              imageLink={NEXT_PUBLIC_ARGO_PLATFORM_ROOT}
            >
              <LinkWhite href={NEXT_PUBLIC_ARGO_PLATFORM_ROOT}>ICGC ARGO</LinkWhite> plans to uniformly analyze specimens from 100,000 cancer patients with high quality clinical data. Learn more about the <LinkWhite href={HOMEPAGE_ARGO_LINK}>ICGC ARGO project</LinkWhite>.
            </LogoParagraphRow>
            <LogoParagraphRow
              Img={<img src="/logo-ICGC-25k.svg" width={'165px'} />}
              imageLink={ICGC_DCC_LINK}
            >
              <LinkWhite href={ICGC_DCC_LINK}>ICGC 25K Data Portal</LinkWhite> has produced &gt;20,000 tumour genomes for 26 cancer types (including{' '}
              <LinkWhite href={ICGC_PCAWG_LINK}>PCAWG</LinkWhite> data).
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
            <PrimaryH2>Overview</PrimaryH2>
            <ParagraphBlack>
              The International Cancer Genome Consortium has tiered levels of access to donor data with strict data access policies. Authorization for access to controlled data is project based and is reviewed for compliance with <Link href="TODO" target="_blank">ICGC Policies and Guidelines</Link>. The ICGC DACO has been created as an independent body to ensure that data from the ICGC will only be used by qualified individuals for public health objectives with no undue risks to donors.
            </ParagraphBlack>
            <ParagraphBlack bold>
              Before starting your application, learn more about <Link href="TODO" target="_blank">Data Access and Use Policies</Link> and review our{' '}
              <Link href={ICGC_ARGO_FAQS} target="_blank">frequently asked questions</Link>.
            </ParagraphBlack>
          </PaddedColumn>
          <PaddedColumn>
            <PrimaryH2>The Application Process is Simple</PrimaryH2>
            <IconParagraphRow img="/icons-brand-apply.svg">
              Log in and start an application. Carefully complete all required sections and review
              all policies and agreements.
            </IconParagraphRow>
            <IconParagraphRow img="/icons-brand-sign.svg">
              When completed, obtain the required signatures and submit the signed application for
              review.
            </IconParagraphRow>
            <IconParagraphRow img="/icons-brand-review.svg">
              The ICGC DACO will review the application and <Link href={DACO_APPLYING_DOCS} target="_blank">eligible project teams</Link> will be granted 2 years of access to ICGC Controlled Data.
            </IconParagraphRow>
          </PaddedColumn>
        </PaddedRow>
      </div>
      {isAccessModalVisible && (
        <ApplyForAccessModal dismissModal={() => setAccessModalVisible(false)} />
      )}
    </>
  );
};

export default Home;
