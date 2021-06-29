import { ReactElement } from 'react';
import Banner, { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_EthicsLetter,
} from './types';
import { isRequired } from './validations';
import { css } from '@emotion/core';
import StaticEthics from '../../PDF/StaticEthics';
import FORM_TEXT from '../../PDF/textConstants';

const EthicsLetter = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_EthicsLetter;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  return (
    <article>
      <StaticEthics />

      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.ethics.title}
        </Typography>

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.declaredAsRequired?.error}
          required={true}
          // required={isRequired(localState.declaredAsRequired)}
        >
          <InputLabel htmlFor="declaredAsRequired">
            {FORM_TEXT.ethics.inputLabel.declaration}
          </InputLabel>

          <RadioCheckboxGroup
            css={css`
              margin-top: 15px;
            `}
            isChecked={localState.declaredAsRequired?.value}
            onChange={validateFieldTouched}
          >
            <FormRadio disabled={isSectionDisabled} value="false" checked>
              {FORM_TEXT.ethics.declarationOptions.notRequired}
            </FormRadio>
            <FormRadio disabled value="true">
              {FORM_TEXT.ethics.declarationOptions.required.a}{' '}
              <Typography bold component="span">
                {FORM_TEXT.ethics.declarationOptions.required.b}{' '}
                <Link href="#" rel="noopener noreferrer" target="_blank">
                  {FORM_TEXT.ethics.declarationOptions.required.link}
                </Link>
                {FORM_TEXT.ethics.declarationOptions.required.c}
              </Typography>
            </FormRadio>
          </RadioCheckboxGroup>

          <FormHelperText onErrorOnly>{localState.declaredAsRequired?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default EthicsLetter;
