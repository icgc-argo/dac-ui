import { ReactElement, ReactNode } from 'react';
import { css } from '@icgc-argo/uikit/index';

import FormFieldHelpBubble from './FormFieldHelpBubble';

const DoubleFieldRow = ({
  actions,
  className = '',
  children,
  helpText,
}: {
  actions?: ReactNode | ReactNode[];
  className?: string;
  children: ReactNode | ReactNode[];
  helpText?: string;
  tooltip?: string;
}): ReactElement => (
  <div
    className={className}
    css={css`
      align-items: flex-start;
      display: flex;

      @media (max-width: 1119px) {
        ${actions
          ? ``
          : `
          flex-wrap : wrap;

          ${
            helpText &&
            `
            > figure {
              margin-left: 150px;
              width: 100%;

              &::before {
                content: none
              }
            }
          `
          }
        `}
      }
      @media (min-width: 1120px) {
        ${helpText || actions
          ? `
          > [class*='FormControl'] {
            width: 100%;
          }
        `
          : `
          > :first-of-type ~ :last-of-type {
            margin-left: 7px;
            width: 50%;
          }

          > :first-of-type:not(:only-child) {
            margin-right: 7px;
            width: 50%;
          }
        `}
      }
    `}
  >
    {Array.isArray(children)
      ? children.map((child) =>
          // check for &nbsp; in case they want half-row-long fields
          child === ' ' ? <div key="emptyFiller" className="emptyFiller" /> : child,
        )
      : children}

    {actions || (helpText && <FormFieldHelpBubble tail="left" text={helpText} width="320px" />)}
  </div>
);

export default DoubleFieldRow;
