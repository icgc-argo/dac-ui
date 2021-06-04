import { ReactElement, ReactNode } from 'react';
import { css } from '@emotion/core';

import FormFieldHelpBubble from './FormFieldHelpBubble';

const DoubleFieldRow = ({
  children,
  helpText,
}: {
  children: ReactNode | ReactNode[];
  helpText?: string;
  tooltip?: string;
}): ReactElement => (
  <div
    css={css`
      align-items: flex-start;
      display: flex;

      @media (max-width: 1119px) {
        flex-wrap: wrap;

        ${helpText &&
        `
          > figure {
            margin-left: 150px;
            width: 100%;

            &::before {
              content: none
            }
          }
        `}
      }
      @media (min-width: 1120px) {
        ${helpText
          ? `
          > :first-of-type:not(.helpText) {
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

    {helpText && <FormFieldHelpBubble tail="left" text={helpText} />}
  </div>
);

export default DoubleFieldRow;
