import { getConfig } from 'global/config';
import { OICR_LINK, POLICIES_PAGE } from 'global/constants/externalPaths';
import React from 'react';
import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { PDFLink, getStaticComponents, Checkbox } from './common';

// is there a nicer way to do this component setup?
// const ContainerComponent = isPdf ? PDFLayout : React.Fragment;
// const SectionComponent = isPdf ? View : Section;
// const TextComponent = isPdf ? PDFParagraph : Typography;
// const LinkComponent = isPdf ? PDFLink : Link;
// const HeaderComponent = isPdf ? PDFTitle : UITitle;
// section for the forms, per section
// this text is not dependent on the application state
// if the static form sections use mostly the same components, setup one function that gets the needed elements,
// then generate the appropriate StaticComponent. i.e. get the components ONCE, then generate whatever section you're in
const StaticIntroduction = ({ isPdf = false, data = {} }: { isPdf?: boolean; data?: any }) => {
  const { NEXT_PUBLIC_ARGO_ROOT } = getConfig();

  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
    LinkComponent,
  } = getStaticComponents(isPdf);
  console.log('in static intro: ', data);
  return (
    <ContainerComponent>
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
          (see Appendix I){isPdf && <PDFLink> ({POLICIES_PAGE})</PDFLink>} including, but not
          limited to, policies concerning the purpose and relevance of the research, the protection
          of the participants and the security of the participants’ data.
        </TextComponent>

        <TextComponent>
          The terms You accept in this application, form an agreement between You and the{' '}
          <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
            Ontario Institute for Cancer Research (“OICR”)
          </LinkComponent>{' '}
          {isPdf && <PDFLink>({OICR_LINK}) </PDFLink>}
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
          {isPdf && <PDFLink> ({NEXT_PUBLIC_ARGO_ROOT})</PDFLink>}.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {/* is the dynamic rendering needed for this? */}
      {isPdf && (
        <SectionComponent>
          <Checkbox
            checked={data?.sections?.terms.agreement.accepted}
            TextComponent={<TextComponent>I acknowledge</TextComponent>}
          />
        </SectionComponent>
      )}
    </ContainerComponent>
  );
};

export default StaticIntroduction;
