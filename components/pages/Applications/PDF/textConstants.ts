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
      one: `You represent and warrant that your country/region does not require your Research
      Project to undergo ethics review.`,
      two: {
        a: `Your country/region requires your Research Project to undergo ethics review, and
        therefore, this Research Project has been approved by an IRB/REC formally designated
        to approve and/or monitor research involving humans.`,
        b: `As per the`,
        link: `Data Access Agreement`,
        c: `, current and applicable ethical approval is the responsibility of the Principal
        Investigator.`,
      },
    },
  },
};

export default FORM_TEXT;
