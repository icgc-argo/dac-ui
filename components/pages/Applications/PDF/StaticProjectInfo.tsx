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
import { View, Link, Text } from '@react-pdf/renderer';
import { LAY_SUMMARY_GUIDE } from 'global/constants';
import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { ApplicationDataByField } from '../types';
import {
  getStaticComponents,
  PdfFormFields,
  PDFParagraph,
  PDFTextArea,
  SectionTitle,
  styles,
} from './common';
import FORM_TEXT from './textConstants';
import { FieldAccessor, PdfFieldName, StaticComponentProps } from './types';
import VerticalTable, { DataCell } from './VerticalTable';

const MIN_PUBLICATION_FIELDS = 3;

const BasicInfo = ({ data }: { data?: Partial<ApplicationDataByField> }) => {
  const infoFields = [PdfFormFields.PROJECT_TITLE, PdfFormFields.PROJECT_WEBSITE];
  return (
    <View
      style={{
        borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
        margin: '10pt 0 30pt',
      }}
    >
      <SectionTitle>{FORM_TEXT.project_info.basic_info}</SectionTitle>
      <VerticalTable
        data={
          infoFields.map((field) => ({
            fieldName: field.fieldName,
            fieldValue: data ? data[field.fieldKey] : '',
          })) as DataCell[]
        }
      />
    </View>
  );
};

export const BackgroundBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { UnorderedListComponent, ListComponent, GenericContainer, TextComponent } =
    getStaticComponents(isPdf);

  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a short summary of the background basis of your research. For example,
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What founding research is your project based on?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          If possible, include any previous research in this area that you have completed that is
          relevant.
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const AimsBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { UnorderedListComponent, ListComponent, GenericContainer, TextComponent } =
    getStaticComponents(isPdf);

  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a summary of what your project hopes to achieve using the ICGC Controlled Data. For
        example:
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          How will your research impact health research or biological understanding?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What are some planned outputs for your research project?
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const DataUseBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { UnorderedListComponent, ListComponent, GenericContainer, TextComponent } =
    getStaticComponents(isPdf);
  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a summary of the methods for your research project and the plans for data usage,
        including:
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What major methods and technologies will you use (in-depth methodology is not required)?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          How exactly will the ICGC Controlled Data be used?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            Please note:
          </TextComponent>{' '}
          If you are planning on combining ICGC controlled data with other datasets, you agree not
          to link or combine the ICGC Controlled Data to other data available in a way that could
          re-identify the donors.{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            Please confirm how the methods you intend to use to combine datasets will minimize the
            risk for re-identification of the ICGC data donors
          </TextComponent>
          <TextComponent as="span" style={{ margin: 0 }}>
            .
          </TextComponent>
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const LaySummaryBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { UnorderedListComponent, ListComponent, GenericContainer, TextComponent, LinkComponent } =
    getStaticComponents(isPdf);
  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a summary of your project targeted towards the general public.
      </TextComponent>
      <TextComponent as="span" bold style={{ display: 'block', fontWeight: 600, margin: 0 }}>
        When writing your lay summary:
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          Develop the language in your lay summary as if you are describing the project to someone
          outside your field.
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          Define any technical terms used.
        </ListComponent>
        <ListComponent asListItem>
          We strongly recommend you use an online readability tool such as{' '}
          <LinkComponent
            bold
            href="https://www.readabilityformulas.com/"
            target="_blank"
            style={{ fontWeight: 600 }}
          >
            www.readabilityformulas.com
          </LinkComponent>{' '}
          to assess the reading grade of your text. The reading grade level to be aimed at for the
          lay summaries is grade 8 or 9.
        </ListComponent>
        <ListComponent asListItem>
          Explain in plain language why you are asking the research question, what you expect to
          find out and how you plan to use the findings.
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          Consider the 3 key elements when developing your lay summary:{' '}
          <TextComponent as="span" bold>
            structure and content, readability, and language guide.{' '}
          </TextComponent>
          <TextComponent as="span" style={{ margin: 0 }}>
            Finding it challenging?{' '}
            <LinkComponent
              bold
              href={LAY_SUMMARY_GUIDE}
              target="_blank"
              style={{ fontWeight: 600 }}
            >
              Read our lay summary guide
            </LinkComponent>
            , which includes before and after examples of real lay summaries.
          </TextComponent>
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

const PdfPublicationsFormData = ({ data = [] }: { data?: string[] }) => {
  const pubData = data.map((d: string) => ({
    fieldName: PdfFieldName.PUBLICATION_URL,
    fieldValue: (
      <Link src={d} style={{ textDecoration: 'underline' }}>
        {d}
      </Link>
    ),
  }));
  // pdf is required to show a minimum of 3 publication fields, so appending empty rows if less than 3 publications have been added
  while (pubData.length < MIN_PUBLICATION_FIELDS) {
    pubData.push({
      fieldName: PdfFieldName.PUBLICATION_URL,
      fieldValue: <Text>{''}</Text>,
    });
  }
  return (
    <View>
      <StaticPublications isPdf />
      <VerticalTable data={pubData} />
    </View>
  );
};

export const StaticResearchSummary = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionTitle, SectionComponent, TextComponent } = getStaticComponents(isPdf);
  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
        marginTop: '5pt',
        marginBottom: '10pt',
      }}
    >
      <SectionTitle>RESEARCH SUMMARY - SCIENTIFIC ABSTRACT</SectionTitle>

      <TextComponent>
        This section should describe the{' '}
        <TextComponent as="span" bold style={{ fontWeight: 600 }}>
          background, aims, and methodology
        </TextComponent>{' '}
        of your research project, as well as plans for{' '}
        <TextComponent as="span" bold style={{ fontWeight: 600 }}>
          how you will use the ICGC Controlled Data.
        </TextComponent>
      </TextComponent>
    </SectionComponent>
  );
};

export const StaticLaySummary = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionComponent, SectionTitle, ButtonComponent } = getStaticComponents(isPdf);

  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
        marginTop: '5pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle
        style={`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        PROJECT LAY SUMMARY
        <ButtonComponent href={LAY_SUMMARY_GUIDE} target="_blank">
          How to write a lay summary
        </ButtonComponent>
      </SectionTitle>
    </SectionComponent>
  );
};

export const StaticPublications = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionComponent, TextComponent, SectionTitle, LinkComponent } =
    getStaticComponents(isPdf);

  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
        marginTop: '5pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>RELEVANT PUBLICATIONS</SectionTitle>

      <TextComponent>
        <TextComponent as="span" bold>
          Please provide at least three links to relevant publications
        </TextComponent>
        , of which the applicant is an author or a co-author. These should be links (URLs) to
        publication websites such as{' '}
        <LinkComponent href="https://pubmed.gov" rel="noopener noreferrer" target="_blank">
          pubmed.gov
        </LinkComponent>
        ,{' '}
        <LinkComponent href="https://biorxiv.org" rel="noopener noreferrer" target="_blank">
          biorxiv.org
        </LinkComponent>
        , or{' '}
        <LinkComponent href="https://medrxiv.org" rel="noopener noreferrer" target="_blank">
          medrxiv.org
        </LinkComponent>
        <TextComponent as="span" style={{ margin: 0 }}>
          .
        </TextComponent>
      </TextComponent>
    </SectionComponent>
  );
};
const StaticProjectInfo = ({ isPdf = false, data, sectionLastUpdatedAt }: StaticComponentProps) => {
  const { ContainerComponent, SectionComponent, TextComponent, TitleComponent } =
    getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent sectionLastUpdatedAt={sectionLastUpdatedAt}>
        D. Project Information
      </TitleComponent>

      <SectionComponent>
        <TextComponent>
          Please fill out the following details for your research project, including the website url
          if available.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <View>
          <BasicInfo data={data?.sections.projectInfo} />
          <StaticResearchSummary isPdf={isPdf} />
          <PDFParagraph style={{ fontWeight: 600 }} wrap>
            {FORM_TEXT.project_info.inputLabel.background}
          </PDFParagraph>
          <BackgroundBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.BACKGROUND]}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.aims}
          </PDFParagraph>
          <AimsBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.AIMS]}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.dataUse}
          </PDFParagraph>
          <DataUseBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.METHODOLOGY]}</PDFTextArea>
          <StaticLaySummary isPdf />
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.laySummary}
          </PDFParagraph>
          <LaySummaryBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.SUMMARY]}</PDFTextArea>
          <PdfPublicationsFormData
            data={data?.sections.projectInfo[FieldAccessor.PUBLICATIONS_URL] as string[]}
          />
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticProjectInfo;
