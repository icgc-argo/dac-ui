import React from 'react';

import { getConfig } from 'global/config';
import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, Checkbox, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import { Text } from '@react-pdf/renderer';
import { ApplicationData } from '../types';

const StaticIntroduction = ({
  isPdf = false,
  data,
}: {
  isPdf?: boolean;
  data?: ApplicationData;
}) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
    LinkComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>Introduction</TitleComponent>
      <SectionComponent>
        <TextComponent>
          This application form must be completed by you and the legal entity with which you are
          affiliated (“You”) prior to being granted access to International Cancer Genome Consortium
          (“ICGC”) controlled data (the “ICGC Controlled Data” as further defined in Section G of
          this application). To receive access, you must complete this entire application form and
          agree to its terms by signing Section G of this application. All sections, as well as
          Appendices I through VIII, are integral components of this application. Your Research
          Project will be checked for conformity with the{' '}
          <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
            goals and policies of ICGC
          </LinkComponent>{' '}
          including, but not limited to, policies concerning the purpose and relevance of the
          research, the protection of the participants and the security of the participants’ data.
        </TextComponent>

        <TextComponent>
          The terms You accept in this application, form an agreement between You and the{' '}
          <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
            Ontario Institute for Cancer Research (“OICR”)
          </LinkComponent>{' '}
          which is the legal entity that administrates the ICGC Controlled Data on behalf of ICGC
          member institutions. OICR includes its employees, officers, directors, contractors,
          subcontractors and agents (including the DACO, as defined immediately below).
        </TextComponent>

        <TextComponent>
          If the Data Access Compliance Office of the ICGC (the “DACO”), approves your application,
          access to the ICGC Controlled Data will be granted for a one year period (starting from
          the date You are approved for access). An Annual Renewal Application must be completed by
          You in order to access/use controlled data beyond that one-year time period and thereafter
          as applicable.
        </TextComponent>

        <TextComponent>
          If your application is approved, You agree that Your application information will be
          included in a registry containing the applicants’ names, institutions and lay summaries of
          the scientific abstracts of all applicants having been granted access to ICGC Controlled
          Data. The ICGC DACO Approved Projects are posted on the{' '}
          <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
            ICGC ARGO website
          </LinkComponent>
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <SectionComponent style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}` }}>
          <SectionTitle>{FORM_TEXT.introduction.title}</SectionTitle>
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

export default StaticIntroduction;
