/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import VerticalTabs from '@icgc-argo/uikit/VerticalTabs';

import { sectionsData } from '../constants';
import FormSection from './Section';
import { FormSectionNames, FormValidationStateParameters, FORM_STATES } from '../types';

const Outline = ({
  sections,
  selectedSection,
  setSelectedSection,
  formState,
}: {
  sections: readonly FormSectionNames[];
  selectedSection: FormSectionNames;
  setSelectedSection: (section: FormSectionNames) => void;
  formState: FormValidationStateParameters;
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
        const status = formState.sections[name]?.meta.overall;
        const showStatus = formState.sections[name]?.meta.showOverall;

        return (
          <FormSection
            active={selectedSection === name}
            key={name}
            label={sectionsData[name]?.description || name}
            status={showStatus || status === FORM_STATES.DISABLED ? status : FORM_STATES.PRISTINE}
            switchSection={() => setSelectedSection(name)}
            tooltip={sectionsData[name].tooltips?.[status] || ''}
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
