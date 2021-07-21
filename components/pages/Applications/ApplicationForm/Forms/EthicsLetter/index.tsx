import { ReactElement, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import StaticEthics from 'components/pages/Applications/PDF/StaticEthics';
import FORM_TEXT from 'components/pages/Applications/PDF/textConstants';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_EthicsLetter,
  FormValidationAction,
} from '../types';
import { isRequired } from '../validations';
import UploadsTable from './UploadsTable';

const EthicsLetter = ({
  appId,
  isSectionDisabled,
  localState,
  refetchAllData,
  validateFieldTouched,
}: {
  appId: string;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_EthicsLetter;
  refetchAllData: (action: Partial<FormValidationAction>) => void;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  const [selectedRadioValue, setSelectedRadioValue] = useState(
    localState.declaredAsRequired?.value || null,
  );
  console.log('ethics', localState);
  // this handler was customised to handle things that ought be handled by the RadioCheckboxGroup itself
  // TODO: improve that, as well as implement the component's focus/blur
  // which will be needed to implement "required field" error behaviours
  const handleSelectedRadioValueChange = (value: boolean) => {
    validateFieldTouched({
      // faking event values to keep scope limited
      target: {
        id: 'declaredAsRequired',
        tagName: 'INPUT',
        type: 'radio',
        value,
      },
      type: 'change',
    });

    setSelectedRadioValue(value);
  };

  const isChecked = (radioValue: boolean) => radioValue === selectedRadioValue;

  useEffect(() => {
    setSelectedRadioValue(localState.declaredAsRequired?.value);
  }, [localState.declaredAsRequired?.value]);

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
          required={isRequired(localState.declaredAsRequired)}
        >
          <InputLabel htmlFor="declaredAsRequired">
            {FORM_TEXT.ethics.inputLabel.declaration}
          </InputLabel>

          <RadioCheckboxGroup
            css={css`
              margin-top: 15px;
            `}
            id="declaredAsRequired"
            isChecked={isChecked}
            onChange={handleSelectedRadioValueChange}
          >
            <FormRadio value={false}>{FORM_TEXT.ethics.declarationOptions.notRequired}</FormRadio>
            <FormRadio value={true}>
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

        {selectedRadioValue && (
          <UploadsTable
            appId={appId}
            isSectionDisabled={isSectionDisabled}
            localState={localState}
            refetchAllData={refetchAllData}
            required={isRequired(localState.approvalLetterDocs)}
          />
        )}
      </section>
    </article>
  );
};

export default EthicsLetter;
