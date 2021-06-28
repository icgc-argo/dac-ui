import Banner, { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import {
  FormSectionValidationState_EthicsLetter,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';
import { css } from '@emotion/core';
import StaticEthics from '../../PDF/StaticEthics';
import FORM_TEXT from '../../PDF/textConstants';

const EthicsLetter = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_EthicsLetter;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_EthicsLetter;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('introduction'));

  return (
    <article>
      <StaticEthics />

      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.ethics.title}
        </Typography>

        <FormControl
          className="vertical"
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
            isChecked={false}
            onChange={function noRefCheck() {}}
          >
            <FormRadio value="one" checked>
              {FORM_TEXT.ethics.declarationOptions.one}
            </FormRadio>
            <FormRadio disabled value="two">
              {FORM_TEXT.ethics.declarationOptions.two.a}{' '}
              <Typography bold component="span">
                {FORM_TEXT.ethics.declarationOptions.two.b}{' '}
                <Link href="#" rel="noopener noreferrer" target="_blank">
                  {FORM_TEXT.ethics.declarationOptions.two.link}
                </Link>
                {FORM_TEXT.ethics.declarationOptions.two.c}
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
