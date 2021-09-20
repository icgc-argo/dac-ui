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

import DashboardCard from '../../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ProgressBar from '../../../../../ApplicationProgressBar';
import { TIME_AND_DATE_FORMAT } from './constants';
import { getFormattedDate, getStatusText } from './helpers';
import ButtonGroup from './ButtonGroup';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { DATE_TEXT_FORMAT } from 'global/constants';
import { ApplicationsResponseItem } from 'components/pages/Applications/types';
import { pick } from 'lodash';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

export interface StatusDates {
  lastUpdatedAtUtc: string;
  createdAtUtc: string;
  submittedAtUtc: string;
  closedAtUtc: string;
  approvedAtUtc: string;
}

const InProgress = ({ application }: { application: ApplicationsResponseItem }) => {
  const theme = useTheme();

  const {
    appId,
    applicant: {
      info: { primaryAffiliation },
    },
    state,
    expiresAtUtc,
    lastUpdatedAtUtc,
    closedAtUtc,
  } = application;

  const dates: StatusDates = {
    lastUpdatedAtUtc,
    ...pick(application, ['createdAtUtc', 'submittedAtUtc', 'closedAtUtc', 'approvedAtUtc']),
  };

  const expiryDate = expiresAtUtc ? (
    `Access Expiry: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`
  ) : closedAtUtc ? (
    <div
      css={css`
        color: ${theme.colors.error};
      `}
    >{`Access Expired: ${getFormattedDate(closedAtUtc, DATE_TEXT_FORMAT)}`}</div>
  ) : (
    ''
  );

  return (
    <DashboardCard title={`Application: ${appId}`} subtitle={primaryAffiliation} info={expiryDate}>
      <div
        css={css`
          margin-top: 5px;
        `}
      >
        <ProgressBar state={state as ApplicationState} />

        <Typography
          variant="data"
          as="div"
          css={css`
            margin-top: 28px;
          `}
        >
          <div
            css={css`
              margin-bottom: 5px;
            `}
          >
            <b>Status:</b> {getStatusText(state as ApplicationState, dates)}
          </div>
          <div>
            <b>Last Updated:</b> {getFormattedDate(lastUpdatedAtUtc, TIME_AND_DATE_FORMAT)}
          </div>
        </Typography>

        <ButtonGroup appId={appId} state={state as ApplicationState} />
      </div>
    </DashboardCard>
  );
};

export default InProgress;
