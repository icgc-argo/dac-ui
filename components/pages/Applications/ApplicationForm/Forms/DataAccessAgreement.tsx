import { ReactElement } from 'react';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_DataAccessAgreements,
} from './types';
import { isRequired } from './validations';
import StaticDataAccessAgreement, {
  StaticDataAgreementsFormSection,
} from '../../PDF/StaticDataAccessAgreement';
import FORM_TEXT from '../../PDF/textConstants';

const DataAccessAgreement = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_DataAccessAgreements;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  return (
    <article>
      <StaticDataAccessAgreement />

      <section>
        <StaticDataAgreementsFormSection />
        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.daa_correct_application_content?.error}
          required={isRequired(localState.agreements?.fields?.daa_correct_application_content)}
        >
          <FormCheckbox
            aria-label="You certify that the contents in the application are true and correct to the best of your knowledge and belief."
            checked={localState.agreements?.fields?.daa_correct_application_content?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_correct_application_content"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.daa_correct_application_content}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_correct_application_content?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.daa_agree_to_terms?.error}
          required={isRequired(localState.agreements?.fields?.daa_agree_to_terms)}
        >
          <FormCheckbox
            aria-label="You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement."
            checked={localState.agreements?.fields?.daa_agree_to_terms?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_agree_to_terms"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.daa_agree_to_terms}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_agree_to_terms?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default DataAccessAgreement;
