/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { Checkbox, getStaticComponents, styles } from './common';
import FORM_TEXT from './textConstants';
import { View, Text } from '@react-pdf/renderer';
import Typography from '@icgc-argo/uikit/Typography';
import { css } from '@icgc-argo/uikit';
import { DataAccessAgreement } from '../../Applications/types';
import { StaticComponentProps } from './types';
import {
  DATA_ACCESS_COMPLIANCE_PAGE,
  DATA_ACCESS_FRAMEWORK_PAGE,
  POLICIES_PAGE,
  PROJECT_LIST_PAGE,
} from 'global/constants';
import { getConfig } from 'global/config';
import termsAndConditionsList from './TermsAndConditionsList';

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
  sectionLastUpdatedAt,
}: StaticComponentProps) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    TitleComponent,
    SectionTitle,
    LinkComponent,
    ListComponent,
  } = getStaticComponents(isPdf);
  const { NEXT_PUBLIC_ARGO_ROOT } = getConfig();
  const ListAsTypography = isPdf ? View : Typography;

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent sectionLastUpdatedAt={sectionLastUpdatedAt}>
        F. Data Access Agreement
      </TitleComponent>

      <SectionComponent>
        <TextComponent>
          This application form must be completed by the applicant and the legal entity with which
          you are affiliated ("You") prior to being granted access to International Cancer Genome
          Consortium ("ICGC") controlled data (the "ICGC Controlled Data" as further defined in
          Section F of this application). To receive access, You must complete this entire
          application form and agree to its terms by signing this application. All sections, as well
          as Appendices I through III, are integral components of this application. Your Research
          Project (as defined below) will be checked for conformity with the{' '}
          <LinkComponent target="_blank" href={POLICIES_PAGE}>
            goals and policies of ICGC ARGO{' '}
          </LinkComponent>
          including, but not limited to, policies concerning the purpose and relevance of the
          research, the protection of the participants and the security of the participants' data.
          The terms You accept in this application, form an agreement between You and The University
          Court of the University of Glasgow, incorporated under the Universities (Scotland) Act
          1889 and having its principal office at University Avenue, Glasgow G12 8QQ, a registered
          Scottish charity in terms of Section 13(2) of the Charities and Trustee Investment
          (Scotland) Act 2005 (Charity Number SC004401, Charity Name 'University of Glasgow Court')
          ("University") which is the legal entity that administrates the ICGC Controlled Data on
          behalf of ICGC member programs. University includes its employees, officers, directors,
          contractors, subcontractors and agents (including the DACO, as defined immediately below).{' '}
        </TextComponent>
        <TextComponent style={{ marginTop: '10pt' }}>
          If the Data Access Compliance Office of the ICGC (the "DACO"), approves your application,
          access to the ICGC Controlled Data will be granted for a two (2) year period starting from
          the date You are approved for access. You may apply for written approval to extend the
          term of this agreement by resubmitting your application for renewal.{' '}
        </TextComponent>
        <TextComponent>
          If your application is approved, You agree that Your application information will be
          included in a public registry containing project details and lay summaries of the
          scientific abstracts of applicants having been granted access to ICGC Controlled Data.{' '}
        </TextComponent>
        <TextComponent>
          You agree you have read the{' '}
          <LinkComponent target="_blank" href={DATA_ACCESS_COMPLIANCE_PAGE}>
            DACO Policies and Procedures
          </LinkComponent>{' '}
          document prior to completing this application.
        </TextComponent>
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
          <ListComponent style={{ marginBottom: 0 }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Consortium:
            </TextComponent>{' '}
            <TextComponent as="span">
              The International Cancer Genome Consortium (ICGC), an international confederation of
              members which is currently in its third phase of work: aiming to uniformly analyze
              specimens from 100,000 donors with high quality clinical data in order to address
              outstanding questions that are vital to the quest to defeat cancer.{' '}
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt', marginTop: '7pt' }}>
            <TextComponent as="span">
              A list of ICGC ARGO members can be found on the Consortium website:{' '}
              <LinkComponent
                href={PROJECT_LIST_PAGE}
                rel="noopener noreferrer"
                target="_blank"
                showHref={false}
              >
                {PROJECT_LIST_PAGE}
              </LinkComponent>
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Data Producer:{' '}
            </TextComponent>
            <TextComponent as="span">
              An ICGC participating center, responsible for the development, organization, and
              oversight of a local database.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              External Collaborator:{' '}
            </TextComponent>
            <TextComponent as="span">
              A collaborator of the User, working for an institution other than the User
              Institution(s) (see below for definitions of User and User Institution(s)).
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              ICGC Controlled Data:{' '}
            </TextComponent>
            <TextComponent as="span">
              The Controlled Access Datasets of the Consortium as defined in section{' '}
              <LinkComponent target="_blank" href={DATA_ACCESS_FRAMEWORK_PAGE}>
                E8.1 Data Access Framework of the Consortium's Policies and Guidelines
              </LinkComponent>
              . Current versions are published on the website at{' '}
              <LinkComponent target="_blank" href={NEXT_PUBLIC_ARGO_ROOT} showHref={false}>
                www.icgc-argo.org
              </LinkComponent>
              .
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Publications:{' '}
            </TextComponent>
            <TextComponent as="span">
              Includes, without limitation, articles published in print journals, electronic
              journals, reviews, books, posters and other written and verbal presentations of
              research.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              Research Participant:{' '}
            </TextComponent>
            <TextComponent as="span">
              An individual having contributed their personal data to an ICGC project, also referred
              to as a Donor.
            </TextComponent>
          </ListComponent>
          <ListComponent style={{ marginBottom: '10pt' }}>
            <TextComponent
              className="definition-category"
              component="span"
              style={styles.highlighted}
            >
              User:{' '}
            </TextComponent>
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
              User Institution(s):{' '}
            </TextComponent>
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
        <SectionTitle>TERMS AND CONDITIONS</SectionTitle>
        <TextComponent>In signing this Agreement:</TextComponent>
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
          {termsAndConditionsList(ListComponent, LinkComponent, TextComponent).map(
            (TermElement, i) => (
              <TermElement count={i + 1} key={i} />
            ),
          )}
        </ListAsTypography>

        <TextComponent
          style={{ paddingTop: '10pt' }}
          css={css`
            padding-bottom: 25px;
          `}
        >
          Data Access Agreement Version 2.0 Published: February 2022
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
