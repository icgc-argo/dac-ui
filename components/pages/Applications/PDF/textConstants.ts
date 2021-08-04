const FORM_TEXT = {
  introduction: {
    title: 'ACKNOWLEDGEMENT',
  },
  applicant: {
    title: 'PRINCIPAL INVESTIGATOR INFORMATION',
    address: 'INSTITUTION/COMPANY MAILING ADDRESS',
  },
  representative: {
    title: 'INSTITUTIONAL REPRESENTATIVE INFORMATION',
    address: 'INSTITUTION/COMPANY MAILING ADDRESS',
  },
  collaborators: {
    personnel: {
      title: 'AUTHORIZED PERSONNEL WITHIN YOUR INSTITUTION',
    },
    students: {
      title: 'AUTHORIZED STUDENTS WITHIN YOUR INSTITUTION',
    },
  },
  project_info: {
    basic_info: 'BASIC INFORMATION',
    research_summary: 'RESEARCH SUMMARY - SCIENTIFIC ABSTRACT',
    project_lay_summary: 'PROJECT LAY SUMMARY',
    relevant_publications: 'RELEVANT PUBLICATIONS',
    inputLabel: {
      background: `Background (max. 200 words)`,
      aims: 'Aims (max. 200 words)',
      dataUse: 'Use of Data and Methodology (max. 200 words)',
      laySummary: 'Lay Summary (max. 200 words)',
    },
  },
  ethics: {
    title: 'ETHICS APPROVAL',
    inputLabel: {
      declaration: 'Please choose one of the following options',
    },
    declarationOptions: {
      notRequired: `You represent and warrant that your country/region does not require your research project to undergo ethics review.`,
      required: {
        a: `Your country/region requires your Research Project to undergo ethics review, and therefore, this research project has been approved by an IRB/REC formally designated to approve and/or monitor research involving humans.`,
        b: `As per the`,
        link: `Data Access Agreement`,
        c: ` (see Section F) current and applicable ethical approval is the responsibility of the Principal Investigator.`,
      },
    },
  },
  dataAccessAgreements: {
    definitions: 'DEFINITIONS',
    dataAccessTerms: 'DATA ACCESS TERMS AND CONDITIONS',
    agreements: 'AGREEMENTS',
    commaSeparator: ', ',
    yes: 'Yes',
    declarations: {
      it_agreement_software_updates: `You will keep all computer systems on which ICGC Controlled Data reside, or which provide access to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable).`,
      it_agreement_protect_data: `You will protect ICGC Controlled Data against disclosure to and use by unauthorized individuals.`,
      it_agreement_monitor_access: `You will monitor and control which individuals have access to ICGC controlled Data.`,
      it_agreement_destroy_copies: `You will securely destroy all copies of ICGC Controlled Data in accordance with the terms and conditions of the Data Access Agreement.`,
      it_agreement_onboard_training: `You will familiarize all individuals who have access to ICGC Controlled Data with the restrictions on its use.`,
      it_agreement_provide_institutional_policies: `You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative.`,
      it_agreement_contact_daco_fraud: `You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the ICGC Controlled Data.`,
      daa_correct_application_content: `You certify that the contents in the application are true and correct to the best of your knowledge and belief.`,
      daa_agree_to_terms: `You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement.`,
    },
  },
  appendices: {
    read_the_appendix: 'Read the Appendix',
    appendix_icgc_goals_policies: {
      title: `APPENDIX I - ICGC ARGO Goals and Policies`,
      text: 'You have read APPENDIX I',
    },
    appendix_data_access_policy: {
      title: `APPENDIX II - Data Access and Data Use Policies and Guidelines`,
      text: 'You have read APPENDIX II',
    },
    appendix_ip_policy: {
      title: `APPENDIX III - Intellectual Property Policy`,
      text: 'You have read APPENDIX III',
    },
  },
};

export default FORM_TEXT;
