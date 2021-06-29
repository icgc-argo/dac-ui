import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { Checkbox, getStaticComponents, PDFLink, styles } from './common';
import FORM_TEXT from './textConstants';
import { View, Text } from '@react-pdf/renderer';
import { AppendixAgreement, ApplicationData } from '../types';

export const ICGCPolicies = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionTitle } = getStaticComponents(isPdf);
  return <SectionTitle>ICGC POLICIES</SectionTitle>;
};

const Appendix = ({ agreement }: { agreement: AppendixAgreement }) => {
  return (
    <View style={{ marginBottom: '10pt' }} wrap={false}>
      <Text
        style={{
          ...styles.text,
          ...{ textTransform: 'uppercase', fontWeight: 'semibold', marginBottom: '3pt' },
        }}
      >
        {FORM_TEXT.appendices[agreement.name].title}
      </Text>
      <View style={{ paddingTop: 2, paddingBottom: 5 }}>
        <Checkbox
          TextComponent={
            <Text>
              {FORM_TEXT.appendices[agreement.name].text} {/* TODO: get correct urls */}
              <PDFLink style={{ fontSize: 11 }}>({'https://www.some_url.com'})</PDFLink>
            </Text>
          }
          checked={agreement.accepted}
        />
      </View>
    </View>
  );
};

const StaticAppendices = ({ isPdf = false, data }: { isPdf?: boolean; data?: ApplicationData }) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    LinkComponent,
    TitleComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>H. Appendices</TitleComponent>

      <SectionComponent>
        <TextComponent>Please review and agree to the following Appendices.</TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <View
          style={{
            borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
            marginTop: '15pt',
            paddingTop: '5pt',
          }}
        >
          <ICGCPolicies isPdf={isPdf} />
          {data?.sections.appendices.agreements.map((agreement) => (
            <Appendix key={agreement.name} agreement={agreement} />
          ))}
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticAppendices;
