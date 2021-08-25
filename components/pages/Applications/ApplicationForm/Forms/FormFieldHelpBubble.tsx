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
import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const HelpBubble = ({
  className,
  tail,
  text,
  width = '100%',
}: {
  className?: string;
  tail?: 'left' | 'right';
  text: ReactNode | ReactElement;
  width?: string;
}): ReactElement => {
  const theme: UikitTheme = useTheme();

  const opposite = tail === 'left' ? 'right' : 'left';

  return (
    <Typography
      as="figure"
      className={className}
      css={css`
        background: ${theme.colors.secondary_4};
        border-radius: 2px;
        box-sizing: border-box;
        font-size: ${tail ? '11' : '12'}px;
        line-height: ${tail ? '14' : '18'}px;
        margin: ${tail ? '0' : '10px'} 0 ${tail ? '10px 10px' : ''};
        padding: 6px 8px;
        position: relative;
        width: ${width};

        &::before {
          border: 5px solid transparent;
          border-bottom: 5px solid transparent;
          ${tail && `border-${opposite}-color: ${theme.colors.secondary_4};`}
          border-top: 5px solid transparent;
          ${tail && 'content: "";'}
          display: block;
          height: 0;
          pointer-events: none;
          position: absolute;
          ${opposite}: 100%;
          top: 5px;
          width: 0;
        }

        ul {
          margin: 3px 0 0;
          padding-left: 15px;
        }

        li:not(:last-of-type) {
          margin: 1px 0;
        }

        span {
          font-size: ${tail ? '11' : '12'}px;
        }
      `}
    >
      {text}
    </Typography>
  );
};

export default HelpBubble;
