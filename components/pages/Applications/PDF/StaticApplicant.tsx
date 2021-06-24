import React from 'react';
import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, styles } from './common';

const StaticApplicant = ({ isPdf = false, data = {} }: { isPdf?: boolean; data: any }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent>
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
    </ContainerComponent>
  );
};

export default StaticApplicant;
