import { ReactElement, useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import Banner, { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import DoubleFieldRow from './DoubleFieldRow';
import FormFieldHelpBubble from './FormFieldHelpBubble';
import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_EthicsLetter,
} from './types';
import { isRequired } from './validations';
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
  const [selectedRadioValue, setSelectedRadioValue] = useState(
    localState.declaredAsRequired?.value || null,
  );

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
          <>
            {/* <DoubleFieldRow helpText="Allowed file types: pdf, doc, docx. | Max file size: 200MB"> */}
            <DoubleFieldRow>
              <FormControl
                className="vertical"
                required={isRequired(localState.approvalLetterDocs)}
              >
                <InputLabel htmlFor="approvalLetterDocs">
                  Please attach an ethics approval letter to this application:
                </InputLabel>
              </FormControl>

              <FormFieldHelpBubble
                css={css`
                  margin: 0 !important;
                `}
                tail="left"
                text="Allowed file types: pdf, doc, docx. | Max file size: 200MB"
              />
            </DoubleFieldRow>

            <Typography>
              If the ethics approval is written in a language other than English,{' '}
              <Typography as="span" bold>
                please upload a version translated to English
              </Typography>
              .
            </Typography>
          </>
        )}
      </section>
    </article>
  );
};

export default EthicsLetter;
