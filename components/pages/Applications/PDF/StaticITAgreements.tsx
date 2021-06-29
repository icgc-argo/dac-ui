import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { Checkbox, getStaticComponents, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import { View, Text } from '@react-pdf/renderer';
import { css } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import { ApplicationData, ITAgreements, ITAgreementEnum } from '../types';

const PdfAgreementsFormData = ({ data }: { data?: ITAgreements }) => {
  const CheckboxText = ({ text }: { text: string }) => (
    <Text>
      <Text style={{ fontWeight: 'semibold' }}>{FORM_TEXT.itAgreements.yes}</Text>
      {FORM_TEXT.itAgreements.commaSeparator}
      {text}
    </Text>
  );
  return (
    <View>
      {data?.agreements
        .filter((agreement) => Object.values(ITAgreementEnum).includes(agreement.name))
        .map((agreement) => (
          <View key={agreement.name} style={{ marginBottom: '10pt' }} wrap={false}>
            <Checkbox
              checked={agreement.accepted}
              TextComponent={
                <CheckboxText text={FORM_TEXT.itAgreements.declarations[agreement.name]} />
              }
            />
          </View>
        ))}
    </View>
  );
};

const StaticITAgreements = ({
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
    ListComponent,
    GenericContainer,
    OrderedListComponent,
    TitleComponent,
    SectionTitle,
  } = getStaticComponents(isPdf);

  const agreementDetails = [
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          Physical Security
        </TextComponent>{' '}
        - ICGC Controlled Data will be maintained on physically secure computer systems, such as in
        a locked office. If the data is stored on a laptop computer, it must be encrypted to avoid
        its disclosure in case of loss or theft.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          Access Security
        </TextComponent>{' '}
        - Only individuals who are listed in this application will have access to ICGC Controlled
        Data. If copies of the ICGC Controlled Data are stored locally on a shared computer system
        or a file server, then they must be strong password and/or encryption protected so that only
        the individuals named in the application have access to it. If the computer that holds ICGC
        Controlled Data is backed up, the backup media must be encrypted and/or stored in a
        physically secure location.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          Network Security
        </TextComponent>{' '}
        - If ICGC Controlled Data is stored on a network-accessible computer, there must be controls
        in place to prevent access by computer "hackers", or contamination by viruses, malware and
        spyware. Network security is usually implemented by your institution's IT department and
        will consist of some combination of network firewalls, network intrusion monitoring, and
        virus scanning software.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          End of Project
        </TextComponent>{' '}
        - After finishing the Research Project for which you are requesting access or if your access
        approval is terminated, you must securely destroy all local copies of the ICGC controlled
        Data, including any backup copies. However, if necessary, you may still keep the ICGC
        Controlled Data for archival purpose in conformity with national audits or other legal
        requirements.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          Training
        </TextComponent>{' '}
        - Everyone who will access and/or use ICGC Controlled Data must be trained in the
        responsible use of personal health information, familiarized with the terms and conditions
        of the data Access Agreement, and briefed on your security plans.
      </ListComponent>
    ),
    ({ count }: { count: number }) => (
      <ListComponent count={count}>
        <TextComponent bold component="span" style={{ fontWeight: 600 }}>
          Computer Cloud Use
        </TextComponent>{' '}
        - You may place copies of ICGC Controlled Data on a private or commercial computer cloud for
        analytical purposes. If you do so, you acknowledge that you maintain responsibility for the
        data and you agree that: you must take care to apply strong encryption to the data while in
        motion and at rest; restrict access to stored copies of the data to yourself, authorized
        personnel, students, and authorized collaborators; use firewall rules to restrict ingress
        and egress from virtual machines to trusted network address(es); keep virtual machines that
        host controlled data up to date with security patches; and destroy all copies of the data,
        including snapshots and backups, at the end of the research Project or if your application
        is not renewed; and ensure there is an agreement in place with your cloud provider that
        ensures you can meet these requirements. Any use of a private or commercial cloud is between
        you and the cloud provider. To the extent permitted by law OICR accepts no responsibility
        for any interaction between you and the cloud provider and is released from any liability
        arising out of or in any way connected with such interaction.
      </ListComponent>
    ),
  ];

  // cannot use TextComponent in pdf context, cannot use plain <ul> in ui context
  // is there a nicer way to do this
  const UlAsTypography = isPdf ? View : Typography;
  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections.applicant.info}
    >
      <TitleComponent>F. Information Technology Agreements</TitleComponent>

      <SectionComponent>
        <TextComponent>
          In order to avoid inadvertent disclosure of ICGC Controlled Data to unauthorized
          individuals, DACO asks that you observe basic information security practices. If you make
          local copies of ICGC Controlled Data, you must minimize the risk that this information
          might be used and/or disclosed to persons who have not been approved for access to ICGC
          Controlled Data.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>

      <SectionComponent
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '15pt',
          marginBottom: '15pt',
        }}
      >
        <SectionTitle>IT AGREEMENT</SectionTitle>

        <TextComponent
          css={css`
            font-size: 13px;
            margin: 0 !important;
          `}
        >
          At a minimum, you agree to the following:
        </TextComponent>

        <OrderedListComponent style={isPdf ? { width: '95%', marginBottom: '15pt' } : {}}>
          {agreementDetails.map((Agreement, i) => (
            <Agreement key={i} count={i + 1} />
          ))}
        </OrderedListComponent>

        <TextComponent
          css={css`
            font-size: 13px;
            margin: 15px 0 !important;
          `}
        >
          Access to ICGC Controlled Data is a procedure that entails legal and ethical obligations.
          You and your institution must have modern, up to date, information technology (IT)
          policies in place that must minimally include the following items:
        </TextComponent>

        <UlAsTypography
          component="ul"
          css={css`
            font-size: 13px;
            padding-left: 15px;
          `}
        >
          <ListComponent asListItem>
            Logging and auditing of access to data and to computer network
          </ListComponent>
          <ListComponent asListItem>Password protection to computer network</ListComponent>
          <ListComponent asListItem>
            Virus and malware protection to computers on computer network
          </ListComponent>
          <ListComponent asListItem>
            Auditable data destruction procedure, when necessary
          </ListComponent>
          <ListComponent asListItem>Secure data backup procedure, when necessary</ListComponent>
          <ListComponent asListItem>
            Strong encryption on any portable device which may store or provide access to ICGC
            controlled access data
          </ListComponent>
          <ListComponent asListItem>Privacy breach notification</ListComponent>
        </UlAsTypography>

        <TextComponent bold style={{ fontWeight: 600, marginTop: '15pt', marginBottom: '15px' }}>
          You MUST agree to the following procedures in order to have access to the ICGC Controlled
          Data:
        </TextComponent>
        {isPdf && <PdfAgreementsFormData data={data?.sections.ITAgreements} />}
      </SectionComponent>
    </ContainerComponent>
  );
};

export default StaticITAgreements;
