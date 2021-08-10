import { Text, View } from '@react-pdf/renderer';
import css from '@emotion/css';

import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import Typography from '@icgc-argo/uikit/Typography';

import { CONTROLLED_DATA_USERS_PAGE, POLICIES_PAGE } from 'global/constants';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, Checkbox, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import { ApplicationData } from '../types';

const StaticTerms = ({ isPdf = false, data }: { isPdf?: boolean; data?: ApplicationData }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
    LinkComponent,
    ListComponent,
  } = getStaticComponents(isPdf);

  const ListAsTypography = isPdf ? View : Typography;

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>Application Terms</TitleComponent>

      <SectionComponent>
        <TextComponent
          css={css`
            margin-bottom: 20px !important;
          `}
        >
          While all ICGC data sources contain open data, sensitive genomic and clinical data is
          controlled and requires permission to access. To qualify for access, you must:
        </TextComponent>

        <ListAsTypography
          component="ul"
          css={css`
            font-size: 13px;
            margin-left: -10px;
            margin-bottom: 25px;
            margin-top: 0;
            padding-left: 25px;
          `}
        >
          <ListComponent asListItem>
            be an independent researcher affiliated with a legal entity (e.g. university professor,
            researcher in a private company, independent researchers able to apply for federal
            research grants, etc.)
          </ListComponent>

          <ListComponent asListItem>
            have an institutional representative at your institution
          </ListComponent>

          <ListComponent asListItem>
            have a scientific abstract outlining the desired use of the ICGC Controlled Data
          </ListComponent>

          <ListComponent asListItem style={{ marginBottom: '10pt' }}>
            have at least 3 qualifying publications of which you were an author/co-author
          </ListComponent>
        </ListAsTypography>

        <TextComponent
          css={css`
            margin-bottom: 20px !important;
          `}
        >
          To receive access, you must:
        </TextComponent>

        <ListAsTypography
          component="ol"
          css={css`
            font-size: 13px;
            margin-left: -10px;
            margin-bottom: 25px;
            margin-top: 0;
            padding-left: 25px;
          `}
          style={isPdf ? { width: '95%' } : {}}
        >
          <ListComponent count={1} style={{ marginBottom: '2pt' }}>
            Complete all required sections on this application form and agree to its terms.
          </ListComponent>

          <ListComponent count={2} style={{ marginBottom: '2pt' }}>
            Have the Principal Investigator and Institutional Representative who represents your
            institution’s legal entity sign the finalized application.
          </ListComponent>

          <ListComponent count={3}>
            Submit the signed application for review by the Data Access Compliance Office (DACO) in
            the “Sign and Submit” section of this application.
          </ListComponent>
        </ListAsTypography>

        <TextComponent>
          During the application process, you must submit a summary of your research project. Your
          project will be checked for conformity with the{' '}
          <LinkComponent href={POLICIES_PAGE} rel="noopener noreferrer" target="_blank">
            goals and policies of ICGC
          </LinkComponent>{' '}
          including, but not limited to, policies concerning the purpose and relevance of the
          research, the protection of the donors and the security of the donors’ data. If your
          application is approved, you agree that your applicant's name, institution, and scientific
          lay summary may be included in a registry of all projects that have been granted access to
          ICGC Controlled Data. The ICGC DACO approved projects are posted on the{' '}
          <LinkComponent
            href={CONTROLLED_DATA_USERS_PAGE}
            rel="noopener noreferrer"
            target="_blank"
          >
            ICGC ARGO website
          </LinkComponent>
          .
        </TextComponent>

        <TextComponent>
          If the Data Access Compliance Office (DACO) approves your application, access to the ICGC
          Controlled Data will be granted for a{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            two year period
          </TextComponent>{' '}
          starting from the date you are approved for access. An annual agreement must be made by
          the applicant and a bi-annual renewal must be completed in order to access/use controlled
          data beyond that two-year time period.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <SectionComponent style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}` }}>
          <SectionTitle>{FORM_TEXT.terms.title}</SectionTitle>
          <Checkbox
            // added '|| false' because typescript complained with possibly undefined data prop
            checked={data?.sections.terms.agreement.accepted || false}
            TextComponent={
              <Text>
                <Text style={{ fontWeight: 600 }}>I acknowledge</Text> that I have read and
                understand the above terms.
              </Text>
            }
          />
        </SectionComponent>
      )}
    </ContainerComponent>
  );
};

export default StaticTerms;
