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

import { css } from '@icgc-argo/uikit';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React from 'react';

type DashboardCardProps = {
  CustomIcon?: any;
  title: string;
  subtitle?: string;
  info?: string | React.ReactNode;
  children: React.ReactNode;
};

const DashboardCard = ({
  title,
  subtitle,
  info,
  children,
  CustomIcon = null,
}: DashboardCardProps) => {
  const theme = useTheme();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
      `}
    >
      <header
        css={css`
          min-height: 60px;
          align-items: center;
          box-sizing: border-box;
          border-bottom: 1px solid ${theme.colors.grey_2};
          display: flex;
          padding: 8px 22px;
        `}
      >
        {(CustomIcon && <CustomIcon />) || (
          <Icon
            css={css`
              margin-right: 8px;
            `}
            width="30px"
            height="30px"
            fill={theme.colors.secondary}
            name="form"
          />
        )}
        <div>
          <Typography
            as="h2"
            css={css`
              margin: 0;
              font-size: 18px;
            `}
            variant="subtitle"
          >
            {title}
          </Typography>
          <Typography
            css={css`
              padding: 0;
              margin: 0;
              font-size: 13px;
              font-weight: bold;
            `}
          >
            {subtitle}
          </Typography>
        </div>
        {info && (
          <Typography
            css={css`
              align-self: flex-start;
              margin: 0;
              margin-left: auto;
              color: #0774d3;
              font-size: 11px;
              font-weight: bold;
              text-align: right;
            `}
          >
            {info}
          </Typography>
        )}
      </header>

      <div
        css={css`
          padding: 24px;
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
