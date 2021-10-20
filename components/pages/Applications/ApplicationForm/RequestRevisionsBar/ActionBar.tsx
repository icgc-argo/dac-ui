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
import { ContentHeader } from '@icgc-argo/uikit/PageLayout';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import React from 'react';

const ActionBar = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <ContentHeader
      css={css`
        border: 0 none;
        height: auto;
        line-height: 1;
        margin-bottom: -16px;
        margin-top: 16px;
      `}
    >
      <div
        css={css`
          align-items: center;
          background: ${theme.colors.warning_3};
          border-radius: 8px;
          box-sizing: border-box;
          display: flex;
          height: auto;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          min-width: 665px;
          padding: 8px 10px 8px 16px;
          width: 100%;
        `}
      >
        <div>{/* Expiry placeholder */}</div>
        <div
          css={css`
            display: flex;
            > button {
              margin-right: 8px;
              &:last-child {
                margin-right: 0;
              }
            }
          `}
        >
          {children}
        </div>
      </div>
    </ContentHeader>
  );
};

export default ActionBar;
