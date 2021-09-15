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
import { format } from 'date-fns';
import { css } from '@icgc-argo/uikit';

import PageHeader from 'components/PageHeader';
import { DATE_TEXT_FORMAT } from 'global/constants';

import Actions from './Actions';
import Details from './Details';
import Progress from './Progress';
import { RefetchData } from '../Forms/types';

const ApplicationHeader = ({
  data = {},
  refetchAllData,
}: {
  data: any;
  refetchAllData: RefetchData;
}): ReactElement => {
  const {
    appId,
    createdAtUtc,
    lastUpdatedAtUtc,
    expiresAtUtc,
    sections: { applicant: { info: { displayName = '', primaryAffiliation = '' } = {} } = {} } = {},
    state,
  } = data;

  const applicant = `${displayName}${primaryAffiliation ? `. ${primaryAffiliation}` : ''}`;

  return (
    <PageHeader>
      <div
        css={css`
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
        `}
      >
        <Details
          appId={appId}
          applicant={applicant}
          createdAt={format(new Date(createdAtUtc), DATE_TEXT_FORMAT)}
          lastUpdated={format(new Date(lastUpdatedAtUtc), DATE_TEXT_FORMAT + ' h:mm aaaa')}
          expiresAt={expiresAtUtc && format(new Date(expiresAtUtc), DATE_TEXT_FORMAT)}
        />

        <Progress state={state} />

        <Actions appId={appId} state={state} refetchAllData={refetchAllData} />
      </div>
    </PageHeader>
  );
};

export default ApplicationHeader;
