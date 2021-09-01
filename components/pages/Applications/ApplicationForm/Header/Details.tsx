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
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';
import { APPLICATIONS_PATH } from 'global/constants';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const HeaderDetails = ({
  applicant,
  createdAt,
  appId,
  lastUpdated,
  expiresAt,
}: {
  applicant?: string;
  createdAt?: string;
  appId: string;
  lastUpdated?: string;
  expiresAt?: string;
}): ReactElement => {
  const theme = useTheme();
  return (
    <section
      css={css`
        padding: 10px 0;
      `}
    >
      <Typography
        component="h1"
        css={css`
          font-size: 16px;
          margin: 0 0 5px;
        `}
      >
        <Link href={APPLICATIONS_PATH}>My Applications</Link>: {appId.toUpperCase()}
        {expiresAt && (
          <>
            {' '}
            |{' '}
            <span
              css={css`
                color: ${theme.colors.secondary}; ;
              `}
            >
              Expires: {expiresAt}
            </span>
          </>
        )}
      </Typography>

      {(createdAt || lastUpdated) && (
        <Typography
          component="p"
          css={css`
            font-size: 12px;
            margin: 0;

            span {
              font-weight: bold;
            }
          `}
          variant="paragraph"
        >
          {createdAt && (
            <>
              {'Created: '}
              <span>{createdAt}</span>
              {lastUpdated && ' | '}
            </>
          )}

          {lastUpdated && (
            <>
              {'Last Updated: '}
              <span>{lastUpdated}</span>
            </>
          )}
        </Typography>
      )}

      <Typography
        component="p"
        css={css`
          font-size: 12px;
          margin: 0;

          ${applicant &&
          `
          span {
            font-weight: bold;
          }
        `}
        `}
        variant="paragraph"
      >
        Applicant: <span>{applicant || 'to be specified'}</span>
      </Typography>
    </section>
  );
};

export default HeaderDetails;
