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
import Icon from '@icgc-argo/uikit/Icon';
import { css, UikitTheme } from '@icgc-argo/uikit/index';
import Tag from '@icgc-argo/uikit/Tag';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import { getValidationUIConfig } from './helpers';
import { FormSectionOverallState } from '../types';

const ValidationIcon = ({ status }: { status: FormSectionOverallState }): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { iconName, tagVariant } = getValidationUIConfig(status);

  return (
    <Tag
      css={css`
        align-items: center;
        border-radius: 50%;
        display: flex;
        height: 22px;
        justify-content: center;
        padding: 0;
        width: 22px;
      `}
      variant={tagVariant}
    >
      <Icon fill={theme.colors.white} height="12px" name={iconName} />
    </Tag>
  );
};

export default ValidationIcon;
