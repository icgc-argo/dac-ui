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
      dataUse: 'Use for Data and Methodology (max. 200 words)',
      laySummary: 'Lay Summary (max. 200 words)',
    },
  },
  ethics: {
    title: 'ETHICS APPROVAL',
    inputLabel: {
      declaration: 'Please choose one of the following options',
    },
    declarationOptions: {
      notRequired: `You represent and warrant that your country/region does not require your Research Project to undergo ethics review.`,
      required: {
        a: `Your country/region requires your Research Project to undergo ethics review, and therefore, this Research Project has been approved by an IRB/REC formally designated to approve and/or monitor research involving humans.`,
        b: `As per the`,
        link: `Data Access Agreement`,
        c: `, current and applicable ethical approval is the responsibility of the Principal Investigator.`,
      },
    },
  },
  itAgreements: {
    commaSeparator: ', ',
    yes: 'Yes',
    declarations: {
      it_agreement_software_updates: `You will keep all computer systems on which ICGC Controlled Data reside, or which provide access to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable).`,
      it_agreement_protect_data: `You will protect ICGC Controlled Data against disclosure to and use by unauthorized
        individuals.`,
      it_agreement_monitor_access: `You will monitor and control which individuals have access to ICGC controlled Data.`,
      it_agreement_destroy_copies: `You will securely destroy all copies of ICGC Controlled Data in accordance with the terms and conditions of the Data Access Agreement.`,
      it_agreement_onboard_training: `You will familiarize all individuals who have access to ICGC Controlled Data with the restrictions on its use.`,
      it_agreement_provide_institutional_policies: `You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative.`,
      it_agreement_contact_daco_fraud: `You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the ICGC Controlled Data.`,
    },
  },
  dataAccessAgreements: {
    definitions: 'DEFINITIONS',
    dataAccessTerms: 'DATA ACCESS TERMS AND CONDITIONS',
    agreements: 'AGREEMENTS',
    commaSeparator: ', ',
    yes: 'Yes',
    declarations: {
      daa_correct_application_content: `You certify that the contents in the application are true and correct to the best of your knowledge and belief.`,
      daa_agree_to_terms: `You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement.`,
    },
  },
  appendices: {
    read_the_appendix: 'Read the Appendix',
    appendix_icgc_goals_policies: {
      title: `APPENDIX I - INTERNATIONAL CANCER GENOME CONSORTIUM, GOALS, STRUCTURE, POLICIES & GUIDELINES (2008)`,
      text: 'You have read APPENDIX I',
    },
    appendix_large_scale_data_sharing: {
      title: `APPENDIX II - SHARING DATA FROM LARGE-SCALE BIOLOGICAL RESEARCH PROJECTS: A SYSTEM OF TRIPARTITE RESPONSIBILITY "THE FT. LAUDERDALE GUIDELINES" (2003)`,
      text: 'You have read APPENDIX II',
    },
    appendix_prepublication_policy: {
      title: `APPENDIX III - TORONTO INTERNATIONAL DATA RELEASE WORKSHOP AUTHORS, PREPUBLICATION DATA SHARING - NATURE 461 (10) 168. (2009)`,
      text: 'You have read APPENDIX III',
    },
    appendix_publication_policy: {
      title: `APPENDIX IV - INTERNATIONAL CANCER GENOME CONSORTIUM, UPDATE TO GOALS, STRUCTURE, POLICIES & GUIDELINES - SECTION E.3 PUBLICATION POLICY (2008 INCLUDING 2010 AND 2012 UPDATES)`,
      text: 'You have read APPENDIX IV',
    },
    appendix_nih_genomic_inventions: {
      title: `APPENDIX V - NATIONAL INSTITUTES OF HEALTH, BEST PRACTICES FOR THE LICENSING OF GENOMIC INVENTIONS (2005)`,
      text: 'You have read APPENDIX V',
    },
    appendix_oecd_genetic_inventions: {
      title: `APPENDIX VI - OECD, GUIDELINES FOR THE LICENSING OF GENETIC INVENTIONS (2006)`,
      text: 'You have read APPENDIX VI',
    },
    appendix_cloud_security: {
      title: `APPENDIX VII - ICGC DCC: BEST PRACTICES FOR SECURING CONTROLLED DATA IN THE CLOUD (2015)`,
      text: 'You have read APPENDIX VII',
    },
    appendix_ga4gh_framework: {
      title: `APPENDIX VIII - GA4GH, FRAMEWORK FOR RESPONSIBLE SHARING OF GENOMIC AND HEALTH-RELATED DATA (2014)`,
      text: 'You have read APPENDIX VIII',
    },
  },
};

export default FORM_TEXT;
