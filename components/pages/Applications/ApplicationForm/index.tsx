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

import { ReactElement, useEffect, useState } from 'react';
import { Method, AxiosResponse, AxiosError } from 'axios';
import urlJoin from 'url-join';

import Loader from 'components/Loader';
import { useAuthContext } from 'global/hooks';
import { API } from 'global/constants';
import ContentError from 'components/placeholders/ContentError';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [data, setData] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);

  const { fetchWithAuth } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      method: 'GET' as Method,
      appId,
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then((res: AxiosResponse) => {
        setData(res.data);
      })
      .catch((err: AxiosError) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lastUpdated]);

  return error ? (
    (console.error('Application form error', error), (<ContentError />))
  ) : isLoading || (data && Object.values(data).length < 1) ? (
    <Loader />
  ) : (
    <>
      <ApplicationHeader data={data} />
      {isAdmin && <RequestRevisionsBar data={data} />}
      <ApplicationFormsBase appId={appId} setLastUpdated={setLastUpdated} />
    </>
  );
};

export default ApplicationForm;
