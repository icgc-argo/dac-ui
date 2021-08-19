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

import { MouseEventHandler, ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
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
  const isDisabled = [FORM_STATES.DISABLED, FORM_STATES.REVISIONS_REQUESTED_DISABLED].includes(
    status,
  );

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
