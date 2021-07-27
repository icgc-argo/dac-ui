import { MouseEventHandler, ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

import ValidationIcon from './ValidationIcon';
import { FormSectionNames, FORM_STATES } from '../types';
import { ApplicationState } from 'components/pages/Applications/types';

const FormSection = ({
  applicationState,
  active = false,
  label = 'unnamed',
  status = FORM_STATES.PRISTINE,
  sectionName,
  switchSection,
  tooltip = '',
}: {
  applicationState: ApplicationState;
  active?: boolean;
  label?: string;
  sectionName: FormSectionNames;
  status?: FORM_STATES;
  switchSection?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}): ReactElement => {
  const isEthicsDisabled = sectionName === 'ethicsLetter' &&
    applicationState === ApplicationState.APPROVED &&
    status === FORM_STATES.LOCKED;
  const isDisabled = isEthicsDisabled || [FORM_STATES.DISABLED, FORM_STATES.REVISIONS_REQUESTED_DISABLED].includes(status);

  return (
    <VerticalTabs.Item
      active={active}
      css={css`
        min-height: 45px;
      `}
      disabled={isDisabled}
      onClick={switchSection}
      tooltip={tooltip}
    >
      <Typography
        css={css`
          font-size: 13px;
          font-weight: bold;
          margin: 0;
        `}
      >
        {label}
      </Typography>

      {![FORM_STATES.DISABLED, FORM_STATES.PRISTINE, FORM_STATES.TOUCHED].includes(status) && (
        <ValidationIcon status={status} />
      )}
    </VerticalTabs.Item>
  );
};

export default FormSection;
