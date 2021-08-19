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
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { styled } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';

const IconWithText = styled('div')`
  min-width: 120px;
  font-size: 11px;
  display: flex;
  flex: 1;
  align-items: center;
  padding: 18px 23px 18px 16px;

  & img {
    margin-right: 7px;
  }
`;

const getConfig = (hasAccess: boolean): { iconName: string; fontColor: string; iconText: string } =>
  hasAccess
    ? {
      iconName: '/icons-checkmark.svg',
      fontColor: 'accent1_dark',
      iconText: 'ICGC DACO Approved!',
    }
    : { iconName: '/icons-controlled-data.svg', fontColor: 'primary', iconText: 'No Access' };

const AccessBox = ({ hasAccess = false }: { hasAccess?: boolean }) => {
  const theme = useTheme();

  const { iconName, iconText, fontColor } = getConfig(hasAccess);

  return (
    <div
      css={css`
        align-self: flex-start;
        border: 1px solid ${theme.colors.grey_2};
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex: 0 0 412px;
      `}
    >
      <IconWithText hasAccess={hasAccess}>
        <img src={iconName} width={40} height={40} />
        <Typography variant="caption" color={fontColor} bold>
          {iconText}
        </Typography>
      </IconWithText>

      <div
        css={css`
          border-left: 1px solid #dcdde1;
          padding: 8px 27px 8px 16px;
          margin: 8px 0;
        `}
      >
        <Typography
          as="span"
          css={css`
            line-height: 1.69;
            font-size: 13px;
          `}
        >
          {hasAccess
            ? 'You have access to ICGC Controlled Data.'
            : 'You do not have access to ICGC Controlled Data.'}
        </Typography>
      </div>
    </div>
  );
};

export default AccessBox;
