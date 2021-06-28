import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import {
  Checkbox,
  getStaticComponents,
  PDFLink,
  PDFParagraph,
  PDFText,
  SectionTitle,
} from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import { css } from '@icgc-argo/uikit';
import { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import Table from './Table';

const StaticAttachLetterMessage = ({ isPdf = false }: { isPdf: boolean }) => {
  const { GenericContainer, TextComponent } = getStaticComponents(isPdf);
  return (
    <GenericContainer>
      <TextComponent bold style={{ fontWeight: 600 }}>
        Please attach an ethics approval letter to this application.
      </TextComponent>
      <TextComponent>
        If the ethics approval is written in a language other than English,{' '}
        <TextComponent bold as="span" style={{ fontWeight: 600 }}>
          please upload a version translated to English
        </TextComponent>
        <TextComponent>.</TextComponent>
      </TextComponent>
    </GenericContainer>
  );
};

interface ApprovalDoc {
  name: 'string';
  objectId: 'string';
  uploadedAtUtc: 'string';
}

const ApprovalLetterDocs = ({ data }: { data: ApprovalDoc[] }) => {
  return (
    <Table
      headers={[
        { name: 'Filename', accessor: 'name' },
        { name: 'Uploaded on', accessor: 'uploadedAtUtc' },
      ]}
      data={data}
    />
  );
};

const PdfEthicsFormData = ({ ethicsRequired }: { ethicsRequired: boolean }) => {
  const OptionTwo = (
    <View>
      {FORM_TEXT.ethics.declarationOptions.two.a}{' '}
      <PDFText>
        {FORM_TEXT.ethics.declarationOptions.two.b}{' '}
        <PDFLink>{FORM_TEXT.ethics.declarationOptions.two.link}</PDFLink>
        {FORM_TEXT.ethics.declarationOptions.two.c}
      </PDFText>
    </View>
  );

  return (
    <View
      style={{
        borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5px',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>{FORM_TEXT.ethics.title}</SectionTitle>
      <View style={{ marginBottom: '10pt' }}>
        <Checkbox
          TextComponent={FORM_TEXT.ethics.declarationOptions.one}
          checked={!ethicsRequired}
        />
      </View>
      <View>
        <Checkbox TextComponent={OptionTwo} checked={ethicsRequired} />
      </View>
    </View>
  );
};

const StaticEthics = ({ isPdf = false, data = {} }: { isPdf?: boolean; data?: any }) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    TitleComponent,
    BannerComponent,
  } = getStaticComponents(isPdf);

  const ethicsRequired = isPdf && data.sections.ethicsLetter.declaredAsRequired;
  return (
    <ContainerComponent
      appId={data.appId}
      state={data.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>E. Ethics</TitleComponent>

      <SectionComponent>
        <TextComponent>
          ICGC is aware that some countries/regions do not require ethics approval for use of coded
          data (i.e. use of the ICGC Controlled Data). Depending on the nature of your Research
          Project, it is possible, however, that such approval is needed in your country. If you are
          uncertain as to whether your Research Project needs ethics approval to use ICGC Controlled
          Data, we suggest you contact your local institutional review board / research ethics
          committee (IRB/REC) to clarify the matter.
        </TextComponent>

        <BannerComponent
          css={css`
            margin-top: 15px;
          `}
          content={
            <TextComponent style={{ margin: 0 }}>
              <TextComponent bold component="span" style={{ fontWeight: 600 }}>
                Please note:
              </TextComponent>{' '}
              The DACO and the ICGC are not responsible for the ethics approval/monitoring of
              individual Research Projects and bear no responsibility for the applicant's failure to
              comply with local/national ethical requirements.
            </TextComponent>
          }
          size="SM"
          variant={BANNER_VARIANTS.WARNING}
        />

        {!isPdf && <RequiredFieldsMessage />}
        {isPdf && (
          <View>
            <PdfEthicsFormData ethicsRequired={ethicsRequired} />
            {ethicsRequired && <StaticAttachLetterMessage isPdf />}
            {ethicsRequired && (
              <ApprovalLetterDocs data={data.sections.ethicsLetter.approvalLetterDocs} />
            )}
          </View>
        )}
      </SectionComponent>
    </ContainerComponent>
  );
};

export default StaticEthics;
