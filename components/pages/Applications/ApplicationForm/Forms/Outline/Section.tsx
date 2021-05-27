import { MouseEventHandler, ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

import { FormSectionOverallStates } from './helpers';
import ValidationIcon from './ValidationIcon';

const FormSection = ({
  active = false,
  label = 'unnamed',
  status = 'pristine',
  switchSection,
  tooltip = '',
}: {
  active?: boolean;
  label?: string;
  status?: FormSectionOverallStates;
  switchSection?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}): ReactElement => {
  const isDisabled = status === 'disabled';

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

      {!['disabled', 'pristine', 'touched'].includes(status) && <ValidationIcon status={status} />}
    </VerticalTabs.Item>
  );
};

export default FormSection;
