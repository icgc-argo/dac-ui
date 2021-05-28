export const sectionsData = {
  appendices: { description: 'H. Appendices' },
  applicant: { description: 'A. Applicant Information' },
  collaborators: { description: 'C. Collaborators' },
  data: { description: 'G. Data Access Agreement' },
  ethics: { description: 'E. Ethics' },
  introduction: { description: 'Introduction' },
  it: { description: 'F. IT Agreements' },
  project: { description: 'D. Project Information' },
  representative: { description: 'B. Institutional Representative' },
  signature: { description: 'Sign & Submit', tooltips: { disabled: 'All required fields must be filled out before submitting the application.' } },
} as Record<string, Record<string, any>>;