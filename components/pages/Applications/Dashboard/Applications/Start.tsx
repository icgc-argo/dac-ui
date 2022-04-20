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

import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import { useDataContext } from 'global/hooks';

import { API, APPLICATIONS_PATH } from 'global/constants';
import { useRouter } from 'next/router';
import urlJoin from 'url-join';
import DashboardCard from '../Card';

const StartApplication = () => {
  const theme = useTheme();
  const { fetchWithAuth } = useDataContext();
  const router = useRouter();

  const createNewApplication = () => {
    fetchWithAuth({
      url: API.APPLICATIONS,
      method: 'POST',
    })
      .then(({ data }: { data: any }) => {
        router.push(urlJoin(APPLICATIONS_PATH, data.appId));
      })
      .catch((e: any) => console.error('Failed to create new application.', e));
  };

  return (
    <DashboardCard title="Start a New Application">
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
        `}
      >
        <Typography
          variant="data"
          css={css`
            margin-bottom: 28px;
            max-width: 520px;
            text-align: center;
          `}
        >
          Start a new application, fill out all required sections, then sign and submit the
          application. The ICGC DACO will review and grant access to eligible project teams.
        </Typography>

        <Button onClick={createNewApplication} size="sm">
          <Icon
            css={css`
              margin-bottom: -2px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="file"
          />
          Start a New Application
        </Button>
      </div>
    </DashboardCard>
  );
};

export default StartApplication;
