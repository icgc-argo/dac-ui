import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { Checkbox, getStaticComponents, styles } from './common';
import FORM_TEXT from './textConstants';
import { View, Text } from '@react-pdf/renderer';
import { ApplicationData } from '../types';
import Typography from '@icgc-argo/uikit/Typography';
import { css } from '@icgc-argo/uikit';
import { DataAccessAgreement } from '../../Applications/types';

const PdfDataAccessFormData = ({ data }: { data?: DataAccessAgreement }) => {
  const CheckboxText = ({ text }: { text: string }) => (
    <Text>
      <Text style={{ fontWeight: 'semibold' }}>{FORM_TEXT.dataAccessAgreements.yes}</Text>
      {FORM_TEXT.dataAccessAgreements.commaSeparator}
      {text}
    </Text>
  );
  return (
    <View>
      {data?.agreements.map((agreement) => (
        <View key={agreement.name} style={{ marginBottom: '10pt' }} wrap={false}>
          <Checkbox
            style={{ paddingBottom: '2pt' }}
            checked={agreement.accepted}
            TextComponent={
              <CheckboxText text={FORM_TEXT.dataAccessAgreements.declarations[agreement.name]} />
            }
          />
        </View>
      ))}
    </View>
  );
};

export const StaticDataAgreementsFormSection = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionTitle, TextComponent, GenericContainer } = getStaticComponents(isPdf);
  return (
    <GenericContainer>
      <SectionTitle>{FORM_TEXT.dataAccessAgreements.agreements}</SectionTitle>

      <TextComponent bold style={{ fontWeight: 600, marginBottom: 10 }}>
        You MUST agree to the following procedures in order to have access to the ICGC Controlled
        Data:
      </TextComponent>
    </GenericContainer>
  );
};

const StaticDataAccessAgreement = ({
  isPdf = false,
  data,
}: {
  isPdf?: boolean;
  data?: ApplicationData;
}) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    TitleComponent,
    SectionTitle,
    LinkComponent,
    ListComponent,
  } = getStaticComponents(isPdf);

  const ListAsTypography = isPdf ? View : Typography;

  const termsAndConditions = [
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to use the ICGC Controlled Data in compliance
        with all ICGC Goals, Structure, Policies and Guidelines including section E. 1 "Informed
        Consent, Access and Ethical Oversight", December 2012 document, included as Appendix I of
        this application form.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to only use the ICGC Controlled Data for the
        objectives and analyses outlined in section D "Research Project" and as approved by their
        ethics committee(s) in the letter requested in section E "Ethics" of this application form
        (if so required).
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to preserve, at all times, the confidentiality of
        the information and ICGC Controlled Data. In particular, they undertake not to use, or
        attempt to use the ICGC Controlled Data to compromise or otherwise infringe the
        confidentiality of information on Research Participants.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to protect the confidentiality of Research
        Participants in any research papers or publications that they prepare by taking all
        reasonable care to limit the possibility of identification.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree not to link or combine the ICGC Controlled Data
        provided under this agreement to other information or archived data available in a way that
        could re-identify the Research Participants, even if access to that data has been formally
        granted to the User and the User Institution(s), or is freely available without restriction.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree not to transfer or disclose the ICGC Controlled
        Data, in whole or part, or any material derived from the ICGC Controlled Data, to anyone not
        listed in section C "Collaborators" of this application form, except as necessary for data
        safety monitoring, national audits or as otherwise required by law. Should the User or the
        User Institution(s) wish to share the ICGC Controlled Data with an External Collaborator,
        the External Collaborator must complete a separate Collaborator's Form for Access to the
        ICGC Controlled Data.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        Without limiting Section G of the application, the User and the User Institution(s) accept
        that the Consortium, the member institutions including producers, depositors, or copyright
        holders, or the funders of the ICGC Controlled Data or any part of the ICGC Controlled Data
        supplied bear no responsibility for the further analysis or interpretation of these ICGC
        Controlled Data, over and above that published by the Consortium.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to follow the Fort Lauderdale Guidelines, the
        Toronto Statement, as well as the GA4GH Framework for Responsible Sharing of Genomic and
        Health-Related Data included as Appendices II, III, and VII of this access document. This
        includes but is not limited to recognizing the contribution of the Consortium and including
        a proper acknowledgement in all reports or publications resulting from the User and the User
        Institutions use of the ICGC Controlled Data.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree to follow the Consortium Publication Policy
        available in the policy section of the ICGC website. This includes respecting the moratorium
        period applicable to global data analyses. Information on the moratorium is included at
        Appendix IV of the application and on the website of individual member projects.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) agree not to make intellectual property claims on the
        ICGC Controlled Data (including somatic mutations) and not to use intellectual property
        protection in way that would prevent or block access to, or use of, any element of the ICGC
        Controlled Data, or conclusion drawn directly from the ICGC Controlled Data.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        The User and the User Institution(s) can elect to perform further research that would add
        intellectual and resource capital to the ICGC Controlled Data and decide to obtain
        intellectual property rights on these downstream discoveries. In this case, the User and the
        User Institution(s) agree to implement licensing policies that will not obstruct further
        research and to follow the U.S. National Institutes of Health’s, Best Practices for the
        Licensing of Genomic Inventions or a similar national guideline that is in conformity with
        the OECD, Guidelines for the Licensing of the Genetic Inventions. These two policies (NIH
        and OECD) are included as Appendices V and VI of this application form.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        Pursuant to Section F of the application, the User and the User Institution(s) agree to
        destroy/discard any ICGC Controlled Data held, once it is no longer used for the project
        described in this application form unless obligated to retain the ICGC Controlled Data for
        archival purposes in conformity with national audits or legal requirements.
      </ListComponent>
    ),
  ];
  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>F. Data Access Agreement</TitleComponent>

      <SectionComponent>
        <TextComponent>
          This agreement governs the terms of access to the{' '}
          <TextComponent bold component="span" style={{ fontWeight: 600 }}>
            ICGC Controlled Data
          </TextComponent>{' '}
          (further defined below). In signing this agreement, you agree to be bound by the terms and
          conditions of access set out therein.
        </TextComponent>

        <TextComponent>
          For the sake of clarity, the terms of access set out in this agreement apply to the User
          and to the User Institution(s) (as defined below). The current agreement is limited to the{' '}
          <TextComponent bold component="span" style={{ fontWeight: 600 }}>
            ICGC Controlled Data
          </TextComponent>{' '}
          (as defined below) and does not cover other data generated at the different centres
          participating in the project.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      <SectionComponent
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '20pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>DEFINITIONS</SectionTitle>

        <ListAsTypography
          component="ul"
          css={css`
            border: 1px solid ${defaultTheme.colors.grey_2};
            list-style: none;
            padding: 15px;
            li {
              > span,
              a {
                font-size: 12px;
              }
              .definition-category {
                font-size: 14px;
              }
              &:not(:last-of-type) {
                margin-bottom: 15px;
              }
            }
          `}
        >
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Consortium:
            </TextComponent>{' '}
            <TextComponent as="span">
              The International Cancer Genome Consortium (ICGC), an international confederation of
              members working to create a catalogue of changes, including mutations in cancer. A
              list of{' '}
            </TextComponent>
            <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
              ICGC members can be found on icgc-argo.org
            </LinkComponent>
            <TextComponent as="span">.</TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Data Producer:
            </TextComponent>{' '}
            <TextComponent as="span">
              An ICGC participating center, responsible for the development, organization, and
              oversight of a local database. External Collaborator: A collaborator of the User,
              working for an institution other than the User Institution(s) (see below for
              definitions of User and User Institution(s)).
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              ICGC Controlled Data:
            </TextComponent>{' '}
            <TextComponent as="span">
              The Controlled Access Datasets of the Consortium as defined in section E 1.3 "Access"
              of the Consortium's Goals, Structure, Policies and Guidelines, April 2008 document
              including 2010 and 2012 updates, included as Appendix I of this application form.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Publications:
            </TextComponent>{' '}
            <TextComponent as="span">
              Includes, without limitation, articles published in print journals, electronic
              journals, reviews, books, posters and other written and verbal presentation of
              research.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Research Participant:
            </TextComponent>{' '}
            <TextComponent as="span">
              An individual having contributed their personal data to an ICGC program.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              User:
            </TextComponent>{' '}
            <TextComponent as="span">
              An applicant (principal investigator), having signed this Data Access Agreement, whose
              User Institution has co-signed this Data Access Agreement, both of them having
              received acknowledgement of its acceptance.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              User Institution(s):
            </TextComponent>{' '}
            <TextComponent as="span">
              Institution(s) at which the User is employed, affiliated or enrolled. A representative
              of it has co-signed this Data Access Agreement with the User and received
              acknowledgement of its acceptance.
            </TextComponent>
          </ListComponent>
        </ListAsTypography>
      </SectionComponent>
      <SectionComponent
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>DATA ACCESS TERMS AND CONDITIONS</SectionTitle>

        <ListAsTypography
          style={isPdf ? { width: '95%' } : {}}
          component="ol"
          css={css`
            font-size: 13px;
            margin-left: -10px;
            padding-left: 25px;

            li {
              padding: 10px;

              &:nth-of-type(even) {
                background: ${defaultTheme.colors.grey_4};
              }
            }
          `}
        >
          {termsAndConditions.map((TermElement, i) => (
            <TermElement count={i + 1} key={i} />
          ))}
        </ListAsTypography>

        <TextComponent
          css={css`
            padding-bottom: 25px;
          `}
        >
          Data Access Agreement last updated on: June 12, 2021
        </TextComponent>
      </SectionComponent>
      {isPdf && (
        <SectionComponent
          style={{
            borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
            marginTop: '25pt',
            paddingTop: '5pt',
          }}
        >
          <StaticDataAgreementsFormSection isPdf={isPdf} />
          <PdfDataAccessFormData data={data?.sections.dataAccessAgreement} />
        </SectionComponent>
      )}
    </ContainerComponent>
  );
};

export default StaticDataAccessAgreement;
