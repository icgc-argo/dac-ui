/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import React, { createContext, useContext, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Canceler, Method } from 'axios';
import Queue from 'promise-queue';
import { getConfig } from 'global/config';
import { useToaster } from './useToaster';
import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';
import { useAuthContext } from 'global/hooks';

type FetchAxiosRequestConfig = AxiosRequestConfig & { retry: boolean };

type T_DataContext = {
  cancelFetchWithAuth: Canceler;
  dataLoading: boolean;
  fetchWithAuth: any;
};

const dataContextDefaults = {
  cancelFetchWithAuth: () => {},
  dataLoading: false,
  fetchWithAuth: () => {},
};

const DataContext = createContext<T_DataContext>(dataContextDefaults);

// setup queue to avoid concurrent requests
const fetchMaxConcurrent = 1;
const fetchMaxQueue = Infinity;
const fetchQueue = new Queue(fetchMaxConcurrent, fetchMaxQueue);

// custom instance of axios
const fetchClient = axios.create();

export const DataProvider = ({ children }: { children: React.ReactElement }) => {
  const [dataLoading, setDataLoading] = useState<boolean>(dataContextDefaults.dataLoading);
  const { forceLogout, getUserJwt } = useAuthContext();
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const toaster = useToaster();

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;

  const fetchWithAuth = async ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) =>
    fetchQueue.add(async () => {
      const isQueueEmpty = fetchQueue.getQueueLength() === 0;

      setDataLoading(true);

      if (!url) {
        setDataLoading(false);
        return Promise.reject(undefined);
      }

      console.log('FETCH - start:', method, url);
      const fetchJwt = await getUserJwt();
      if (!fetchJwt) {
        console.log('FETCH - invalid JWT:', fetchJwt.slice(-10));
        setDataLoading(false);
        return Promise.reject(undefined);
      }

      const config: FetchAxiosRequestConfig = {
        ...(!['DELETE', 'GET'].includes(method) && { data }),
        baseURL: NEXT_PUBLIC_DAC_API_ROOT,
        cancelToken: cancelTokenSource.token,
        headers: {
          accept: '*/*',
          ...(['POST'].includes(method) && {
            ['Access-Control-Allow-Origin']: '*',
            ['Content-Type']: 'application/json;charset=utf-8',
          }),
          Authorization: `Bearer ${fetchJwt}`,
          ...headers,
        },
        method,
        params,
        retry: false,
        ...(responseType ? { responseType } : {}),
        url,
      };

      fetchClient.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
          const retryConfig = error.config as FetchAxiosRequestConfig;
          if (error?.response?.status === 401 && !retryConfig.retry) {
            retryConfig.retry = true;
            const retryJwt = await getUserJwt();
            console.log('FETCH - retry - JWT:', retryJwt.slice(-10));
            retryConfig.headers.Authorization = `Bearer ${retryJwt}`;
            return fetchClient(retryConfig);
          }
          return Promise.reject(error);
        },
      );

      return fetchClient(config)
        .catch((error) => {
          // status code outside 2xx range
          if (error?.response?.status === 401) {
            // retry failed
            console.log('FETCH - retry failed with 401');
            forceLogout({ userHadSession: true });
            setDataLoading(false);
          } else {
            toaster.addToast({
              title: 'Something went wrong!',
              variant: TOAST_VARIANTS.ERROR,
              content: 'Please try performing your action again.',
            });
          }
          // TODO: log errors somewhere not visible to the user?
          // Leaving this log here pre-release, for troubleshooting
          console.error('Error in fetchWithAuth', { error });
          throw { error };
        })
        .finally(() => {
          setDataLoading(!isQueueEmpty);
        });
    });

  const dataContextValue = {
    cancelFetchWithAuth,
    dataLoading,
    fetchWithAuth,
  };

  return <DataContext.Provider value={dataContextValue}>{children}</DataContext.Provider>;
};

export default function useDataContext() {
  return useContext(DataContext);
}
