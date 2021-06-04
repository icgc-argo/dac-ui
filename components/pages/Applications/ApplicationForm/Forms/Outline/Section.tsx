import { MouseEventHandler, ReactElement } from 'react';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

import ValidationIcon from './ValidationIcon';
import { FORM_STATES } from '../types';

const FormSection = ({
  active = false,
  label = 'unnamed',
  status = FORM_STATES.PRISTINE,
  switchSection,
  tooltip = '',
}: {
  active?: boolean;
  label?: string;
  status?: FORM_STATES;
  switchSection?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}): ReactElement => {
  const isDisabled = status === FORM_STATES.DISABLED;

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
