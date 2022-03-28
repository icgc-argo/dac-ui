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
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Loader from 'components/Loader';
import { useAuthContext } from 'global/hooks';
import { hasDacoScope, isDacoAdmin } from 'global/utils/egoTokenUtils';
import { PageHead } from 'components/Head';

const ApplicationForm = dynamic(() => import('./ApplicationForm'), { loading: Loader });
const ManageApplications = dynamic(() => import('./ManageApplications'), { loading: Loader });
const Dashboard = dynamic(() => import('./Dashboard'), { loading: Loader });

type QueryType = {
  query: {
    ID?: string[];
  };
};

const Application = (): ReactElement => {
  const {
    query: { ID: [appId = ''] = [] },
  }: QueryType = useRouter();
  const { permissions, userLoading } = useAuthContext();

  const isAdmin = permissions.length > 0 && isDacoAdmin(permissions);

  const hasDacoAccess = hasDacoScope(permissions);
  const normalisedAppId = appId.toUpperCase();
  const pageTitle = normalisedAppId || 'Application page';

  return (
    <>
      <PageHead title={pageTitle} />
      {userLoading ? (
        <Loader />
      ) : appId ? (
        <ApplicationForm appId={normalisedAppId} isAdmin={isAdmin} />
      ) : isAdmin ? (
        <ManageApplications />
      ) : (
        <Dashboard hasDacoAccess={hasDacoAccess} />
      )}
    </>
  );
};

export default Application;
