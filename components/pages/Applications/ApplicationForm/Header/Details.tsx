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
import { APPLICATIONS_PATH, DATE_TEXT_FORMAT } from 'global/constants';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { ApplicationAccessInfo } from '.';
import { format, parseISO } from 'date-fns';

const isValidDate = (val?: any): boolean => {
  try {
    parseISO(val);
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
};

const ApplicationAccessInfoDisplay = ({ date, isWarning, status }: ApplicationAccessInfo) => {
  const theme = useTheme();
  return (
    <>
      {' '}
      |{' '}
      <span
        css={css`
          color: ${theme.colors[isWarning ? 'error' : 'secondary']};
        `}
      >
        {`${status}: ${date && isValidDate(date) ? format(new Date(date), DATE_TEXT_FORMAT) : ''}`}
      </span>
    </>
  );
};

const HeaderDetails = ({
  applicant,
  createdAt,
  appId,
  lastUpdated,
  accessInfo,
}: {
  applicant?: string;
  createdAt?: string;
  appId: string;
  lastUpdated?: string;
  accessInfo?: ApplicationAccessInfo;
}): ReactElement => {
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
        {accessInfo && (
          <ApplicationAccessInfoDisplay
            date={accessInfo.date}
            isWarning={accessInfo.isWarning}
            status={accessInfo.status}
          />
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
