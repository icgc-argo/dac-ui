import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_DataAccessAgreements,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';

const DataAccessAgreements = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_DataAccessAgreements;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const theme: UikitTheme = useTheme();
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_DataAccessAgreements;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('dataAccessAgreements'));

  return (
    <article>
      <Typography bold component="h2">
        G. Data Access Agreement
      </Typography>

      <section>
        <Typography>
          This agreement governs the terms of access to the{' '}
          <Typography bold component="span">
            ICGC Controlled Data
          </Typography>{' '}
          (further defined below). In signing this agreement, you agree to be bound by the terms and
          conditions of access set out therein.
        </Typography>

        <Typography>
          For the sake of clarity, the terms of access set out in this agreement apply to the User
          and to the User Institution(s) (as defined below). The current agreement is limited to the
          <Typography bold component="span">
            ICGC Controlled Data
          </Typography>{' '}
          (as defined below) and does not cover other data generated at the different centres
          participating in the project.
        </Typography>

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          DEFINITIONS
        </Typography>

        <Typography
          component="ul"
          css={css`
            border: 1px solid ${theme.colors.grey_2};
            font-size: 12px;
            list-style: none;
            padding: 15px;

            li {
              &:not(:last-of-type) {
                margin-bottom: 15px;
              }

              > span {
                color: ${theme.colors.secondary};
              }
            }
          `}
        >
          <li>
            <Typography component="span">Consortium:</Typography> The International Cancer Genome
            Consortium (ICGC), an international confederation of members working to create a
            catalogue of changes, including mutations in cancer. A list of{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              ICGC members can be found on icgc-argo.org
            </Link>
            .
          </li>
          <li>
            <Typography component="span">Data Producer:</Typography> An ICGC participating center,
            responsible for the development, organization, and oversight of a local database.
            External Collaborator: A collaborator of the User, working for an institution other than
            the User Institution(s) (see below for definitions of User and User Institution(s)).
          </li>
          <li>
            <Typography component="span">ICGC Controlled Data:</Typography> The Controlled Access
            Datasets of the Consortium as defined in section E 1.3 "Access" of the Consortium's
            Goals, Structure, Policies and Guidelines, April 2008 document including 2010 and 2012
            updates, included as Appendix I of this application form.
          </li>
          <li>
            <Typography component="span">Publications:</Typography> Includes, without limitation,
            articles published in print journals, electronic journals, reviews, books, posters and
            other written and verbal presentation of research.
          </li>
          <li>
            <Typography component="span">Research Participant:</Typography> An individual having
            contributed their personal data to an ICGC program.
          </li>
          <li>
            <Typography component="span">User:</Typography> An applicant (principal investigator),
            having signed this Data Access Agreement, whose User Institution has co-signed this Data
            Access Agreement, both of them having received acknowledgement of its acceptance.
          </li>
          <li>
            <Typography component="span">User Institution(s):</Typography> Institution(s) at which
            the User is employed, affiliated or enrolled. A representative of it has co-signed this
            Data Access Agreement with the User and received acknowledgement of its acceptance.
          </li>
        </Typography>
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          DATA ACCESS TERMS AND CONDITIONS
        </Typography>

        <Typography
          component="ol"
          css={css`
            font-size: 13px;
            margin-left: -10px;
            padding-left: 25px;

            li {
              padding: 10px;

              &:nth-of-type(even) {
                background: ${theme.colors.grey_4};
              }
            }
          `}
        >
          <li>
            The User and the User Institution(s) agree to use the ICGC Controlled Data in compliance
            with all ICGC Goals, Structure, Policies and Guidelines including section E. 1 "Informed
            Consent, Access and Ethical Oversight", December 2012 document, included as Appendix I
            of this application form.
          </li>
          <li>
            The User and the User Institution(s) agree to only use the ICGC Controlled Data for the
            objectives and analyses outlined in section D "Research Project" and as approved by
            their ethics committee(s) in the letter requested in section E "Ethics" of this
            application form (if so required).
          </li>
          <li>
            The User and the User Institution(s) agree to preserve, at all times, the
            confidentiality of the information and ICGC Controlled Data. In particular, they
            undertake not to use, or attempt to use the ICGC Controlled Data to compromise or
            otherwise infringe the confidentiality of information on Research Participants.
          </li>
          <li>
            The User and the User Institution(s) agree to protect the confidentiality of Research
            Participants in any research papers or publications that they prepare by taking all
            reasonable care to limit the possibility of identification.
          </li>
          <li>
            The User and the User Institution(s) agree not to link or combine the ICGC Controlled
            Data provided under this agreement to other information or archived data available in a
            way that could re-identify the Research Participants, even if access to that data has
            been formally granted to the User and the User Institution(s), or is freely available
            without restriction.
          </li>
          <li>
            The User and the User Institution(s) agree not to transfer or disclose the ICGC
            Controlled Data, in whole or part, or any material derived from the ICGC Controlled
            Data, to anyone not listed in section C "Collaborators" of this application form, except
            as necessary for data safety monitoring, national audits or as otherwise required by
            law. Should the User or the User Institution(s) wish to share the ICGC Controlled Data
            with an External Collaborator, the External Collaborator must complete a separate
            Collaborator's Form for Access to the ICGC Controlled Data.
          </li>
          <li>
            Without limiting Section G of the application, the User and the User Institution(s)
            accept that the Consortium, the member institutions including producers, depositors, or
            copyright holders, or the funders of the ICGC Controlled Data or any part of the ICGC
            Controlled Data supplied bear no responsibility for the further analysis or
            interpretation of these ICGC Controlled Data, over and above that published by the
            Consortium.
          </li>
          <li>
            The User and the User Institution(s) agree to follow the Fort Lauderdale Guidelines, the
            Toronto Statement, as well as the GA4GH Framework for Responsible Sharing of Genomic and
            Health-Related Data included as Appendices II, III, and VII of this access document.
            This includes but is not limited to recognizing the contribution of the Consortium and
            including a proper acknowledgement in all reports or publications resulting from the
            User and the User Institutions use of the ICGC Controlled Data.
          </li>
          <li>
            The User and the User Institution(s) agree to follow the Consortium Publication Policy
            available in the policy section of the ICGC website. This includes respecting the
            moratorium period applicable to global data analyses. Information on the moratorium is
            included at Appendix IV of the application and on the website of individual member
            projects.
          </li>
          <li>
            The User and the User Institution(s) agree not to make intellectual property claims on
            the ICGC Controlled Data (including somatic mutations) and not to use intellectual
            property protection in way that would prevent or block access to, or use of, any element
            of the ICGC Controlled Data, or conclusion drawn directly from the ICGC Controlled Data.
          </li>
          <li>
            The User and the User Institution(s) can elect to perform further research that would
            add intellectual and resource capital to the ICGC Controlled Data and decide to obtain
            intellectual property rights on these downstream discoveries. In this case, the User and
            the User Institution(s) agree to implement licensing policies that will not obstruct
            further research and to follow the U.S. National Institutes of Health’s, Best Practices
            for the Licensing of Genomic Inventions or a similar national guideline that is in
            conformity with the OECD, Guidelines for the Licensing of the Genetic Inventions. These
            two policies (NIH and OECD) are included as Appendices V and VI of this application
            form.
          </li>
          <li>
            Pursuant to Section F of the application, the User and the User Institution(s) agree to
            destroy/discard any ICGC Controlled Data held, once it is no longer used for the project
            described in this application form unless obligated to retain the ICGC Controlled Data
            for archival purposes in conformity with national audits or legal requirements.
          </li>
        </Typography>

        <Typography>Data Access Agreement last updated on: June 12, 2021</Typography>
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          AGREEMENTS
        </Typography>

        <Typography bold>In signing this Agreement:</Typography>

        <FormControl
          error={!!localState.agreements?.fields?.daa_correct_application_content?.error}
          required={isRequired(localState.agreements?.fields?.daa_correct_application_content)}
        >
          <FormCheckbox
            aria-label="You certify that the contents in the application are true and correct to the best of your knowledge and belief."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.daa_correct_application_content?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_correct_application_content"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You certify that the contents in the application are true and correct to the best of
            your knowledge and belief.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_correct_application_content?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.daa_agree_to_terms?.error}
          required={isRequired(localState.agreements?.fields?.daa_agree_to_terms)}
        >
          <FormCheckbox
            aria-label="You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.daa_agree_to_terms?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_agree_to_terms"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You have read and agree to abide by the terms and conditions outlined in the Data
            Access Agreement.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_agree_to_terms?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default DataAccessAgreements;
