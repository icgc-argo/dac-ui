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

import css from '@emotion/css';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { VisibleModalOption } from './types';

const ApplicationActions = ({
  disabled,
  setVisibleModal,
}: {
  disabled: boolean;
  setVisibleModal: (type: VisibleModalOption) => void;
}) => {
  const theme = useTheme();
  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.APPROVAL);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={css`
              margin-right: 1px;
              margin-left: -4px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="checkmark"
          />
          Approve
        </span>
      </Button>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.REVISIONS);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={instructionBoxButtonIconStyle}
            fill={theme.colors.white}
            height="9px"
            name="edit"
          />
          Request Revisions
        </span>
      </Button>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.REJECTION);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={instructionBoxButtonIconStyle}
            fill={theme.colors.white}
            height="10px"
            name="times"
          />
          Reject
        </span>
      </Button>
    </>
  );
};

export default ApplicationActions;
