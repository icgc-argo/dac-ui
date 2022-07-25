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
import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';
import router from 'next/router';
import { ERROR_PATH } from 'global/constants/internalPaths';
import { useFormValidation } from './Forms/validations';
import { ApplicationData } from '../types';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [data, setData] = useState<ApplicationData | undefined>(undefined);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const { fetchWithAuth } = useAuthContext();

  const { isLoading: isFormLoading, formState, validateSection } = useFormValidation(appId);

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
        console.error('Application form error', err);
        return router.push(ERROR_PATH);
      })
      .finally(() => {
        setIsAppLoading(false);
      });
  }, [lastUpdated]);

  return isAppLoading || (data && Object.values(data).length < 1) ? (
    <Loader />
  ) : data ? (
    <>
      <ApplicationHeader refetchAllData={formState.__refetchAllData} data={data} />
      {isAdmin && <RequestRevisionsBar data={data} setLastUpdated={setLastUpdated} />}
      <ApplicationFormsBase
        appId={appId}
        applicationState={data?.state}
        sectionData={data?.sections}
        setLastUpdated={setLastUpdated}
        isLoading={isFormLoading}
        formState={formState}
        validateSection={validateSection}
        isAttestable={data?.isAttestable}
        attestedAtUtc={data?.attestedAtUtc}
        refetchAllData={formState.__refetchAllData}
      />
    </>
  ) : (
    <div></div>
  );
};

export default ApplicationForm;
