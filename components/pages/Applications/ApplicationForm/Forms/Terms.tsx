import { ReactElement } from 'react';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';

import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_Introduction,
} from './types';
import { isRequired } from './validations';
import FORM_TEXT from '../../PDF/textConstants';

const Introduction = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Introduction;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  return (
    <article>
      <section>
        <StaticIntroduction />
      </section>
      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.introduction.title}
        </Typography>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreement?.error}
          required={isRequired(localState.agreement)}
        >
          <FormCheckbox
            aria-label="I acknowledge that I have read and understand the above terms."
            checked={localState.agreement?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreement"
          >
            <Typography bold component="span">
              I acknowledge
            </Typography>{' '}
            that I have read and understand the above terms.
          </FormCheckbox>

          <FormHelperText onErrorOnly>{localState.agreement?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Introduction;