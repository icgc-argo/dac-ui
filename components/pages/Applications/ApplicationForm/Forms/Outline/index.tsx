import { Dispatch, MouseEventHandler, ReactElement, SetStateAction } from 'react';
import { css } from '@icgc-argo/uikit';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

import { sectionsData } from './constants';
import FormSection from './Section';
import { FormSectionNames } from '../types';

const Outline = ({
  sections,
  selectedSection,
  setSelectedSection = () => {},
  validationState,
}: {
  sections: readonly FormSectionNames[];
  selectedSection: FormSectionNames;
  setSelectedSection: Dispatch<SetStateAction<FormSectionNames>>;
  validationState: Record<FormSectionNames, any>;
}): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <VerticalTabs
      css={css`
        background: ${theme.colors.grey_4};
        border-radius: 8px 0 0 8px;
        margin: -8px 0;
        margin-left: -8px;
        min-width: 205px;
        max-width: 280px;
      `}
    >
      <Typography // title
        css={css`
          border-bottom: 1px solid ${theme.colors.grey_2};
          font-size: 16px;
          line-height: 45px;
          margin: 0;
          padding: 0 13px;
        `}
      >
        Table of Contents
      </Typography>

      {sections.map((name) => {
        const status = validationState[name]?.overall;

        return (
          <FormSection
            active={selectedSection === name}
            key={name}
            label={sectionsData[name]?.description || name}
            status={status}
            switchSection={() => setSelectedSection(name)}
            tooltip={sectionsData[name]?.tooltips?.[status]}
          />
        );
      })}

      <Typography // notes
        css={css`
          /* border-top: 1px solid ${theme.colors.grey_2}; */
          font-size: 16px;
          line-height: 45px;
          margin: 0;
          padding: 0 13px;
        `}
      >
        &nbsp;
      </Typography>
    </VerticalTabs>
  );
};

export default Outline;
