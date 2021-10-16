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
        & [class*='FormControl']:not(:first-of-type) {
          margin-top: 10px !important;
        }

        ${actions
          ? ``
          : `
          flex-wrap : wrap;

          ${
            helpText &&
            `
            > figure {
              margin-top: 5px;
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
