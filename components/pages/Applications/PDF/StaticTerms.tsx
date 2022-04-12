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

import { Text, View } from '@react-pdf/renderer';
import css from '@emotion/css';

import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import Typography from '@icgc-argo/uikit/Typography';

import { CONTROLLED_DATA_USERS_PAGE, POLICIES_PAGE } from 'global/constants';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, Checkbox, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import { StaticComponentProps } from './types';

const StaticTerms = ({ isPdf = false, data, sectionLastUpdatedAt }: StaticComponentProps) => {
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
      <TitleComponent sectionLastUpdatedAt={sectionLastUpdatedAt}>Application Terms</TitleComponent>

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
            have a scientific abstract and lay summary outlining the desired use of the ICGC
            Controlled Data
          </ListComponent>

          <ListComponent asListItem>
            have at least 3 qualifying publications of which you were an author/co-author
          </ListComponent>

          <ListComponent asListItem style={{ marginBottom: '10pt' }}>
            include an ethics letter, if ethics approval for use of ICGC Controlled Data is required
            in your country/region
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
          lay summary may be included in a public registry of projects that have been granted access
          to ICGC Controlled Data.
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
