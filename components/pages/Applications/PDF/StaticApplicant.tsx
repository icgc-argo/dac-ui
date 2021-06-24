import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, SectionTitle } from './common';
import FORM_TEXT from './textConstants';

const StaticApplicant = ({ isPdf = false, data = {} }: { isPdf?: boolean; data?: any }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data.appId}
      state={data.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>A. Applicant Information (Principal Investigator)</TitleComponent>
      <SectionComponent>
        <TextComponent>
          Qualified applicants for access to the ICGC Controlled Data{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            must be independent researchers who are affiliated with a legal entity
          </TextComponent>{' '}
          (e.g. university professor, researcher in a private company, independent researchers able
          to apply for federal research grants, etc.).
        </TextComponent>

        <TextComponent>
          Please include a valid Google email address that will be used to log in to ICGC ARGO and
          ICGC 25K and will be the email address associated with ICGC Controlled Data access.
        </TextComponent>
        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <SectionComponent style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}` }}>
          <SectionTitle>{FORM_TEXT.applicant.title}</SectionTitle>
        </SectionComponent>
      )}
    </ContainerComponent>
  );
};

export default StaticApplicant;
