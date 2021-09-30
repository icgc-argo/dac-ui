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

import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import { ApplicationsField, ApplicationsResponseItem } from 'components/pages/Applications/types';
import { isEmpty } from 'lodash';
import { useGetApplications } from 'global/hooks';
import Loader from 'components/Loader';
import router from 'next/router';
import { ERROR_PATH } from 'global/constants';
import CollaboratorApplication from './CollaboratorApplication';

const Applications = () => {
  const { error, isLoading, response } = useGetApplications({
    sort: [{ field: ApplicationsField.lastUpdatedAtUtc, order: 'desc' }],
  });

  if (error) {
    router.push(ERROR_PATH);
  }

  const applications = response?.data?.items || [];

  return isLoading ? (
    <Loader
      css={css`
        margin: 24px auto;
      `}
    />
  ) : (
    <div
      css={css`
        display: grid;
        grid-gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        margin-bottom: 24px;
      `}
    >
      {!isEmpty(applications) &&
        applications.map((application: ApplicationsResponseItem) => (
          <InProgress application={application} key={application.appId} />
        ))}
      <StartApplication />
      {[].map(() => (
        <CollaboratorApplication />
      ))}
    </div>
  );
};

export default Applications;
