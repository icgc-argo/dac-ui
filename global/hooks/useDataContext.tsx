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

import React, { createContext, useContext, useState } from 'react';
import { isValidJwt } from '../utils/egoTokenUtils';
import axios, { AxiosRequestConfig, Canceler, Method } from 'axios';
import { getConfig } from 'global/config';
import { useToaster } from './useToaster';
import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';
import refreshJwt from 'global/utils/auth/refreshJwt';
import useUserContext from './useUserContext';
import { getStoredJwt } from 'global/utils/auth/helpers';

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

export const DataProvider = ({ children }: { children: React.ReactElement }) => {
  const [dataLoading, setDataLoading] = useState<boolean>(dataContextDefaults.dataLoading);
  const { token, logout, handleUserJwt } = useUserContext();
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const toaster = useToaster();

  // TODO: decide if we want these for all types of requests or only POST
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;

  const fetchWithAuth = async ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) => {
    setDataLoading(true);
    if (!url || !token) {
      setDataLoading(false);
      return Promise.reject(undefined);
    }

    let fetchToken = token;

    if (!isValidJwt(token)) {
      console.log('🐶 FETCH state token is not valid');
      const storageToken = getStoredJwt();
      if (isValidJwt(storageToken)) {
        console.log('🐶 FETCH localStorage token is valid');
        handleUserJwt(storageToken);
        fetchToken = storageToken;
      } else {
        console.log('🐶 FETCH localStorage token is not valid');
        const refreshedJwt = (await refreshJwt().catch(logout)) as string;
        if (isValidJwt(refreshedJwt)) {
          console.log('FETCH refreshed token is valid');
          handleUserJwt(refreshedJwt);
          fetchToken = refreshedJwt;
        } else {
          console.log('🐶 FETCH refreshed token is not valid');
          logout();
          setDataLoading(false);
          return Promise.reject(undefined);
        }
      }
    }

    const config: AxiosRequestConfig = {
      ...(!['DELETE', 'GET'].includes(method) && { data }),
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      cancelToken: cancelTokenSource.token,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${fetchToken || ''}`,
      },
      method,
      params,
      ...(responseType ? { responseType } : {}),
      url,
    };

    return axios(config)
      .catch((error) => {
        // status code outside 2xx range
        toaster.addToast({
          title: 'Something went wrong!',
          variant: TOAST_VARIANTS.ERROR,
          content: 'Please try performing your action again.',
        });
        // TODO: log errors somewhere not visible to the user?
        // Leaving this log here pre-release, for troubleshooting
        console.error('Error in fetchWithAuth', { error });
        throw { error };
      })
      .finally(() => {
        setDataLoading(false);
      });
  };

  const authData = {
    cancelFetchWithAuth,
    dataLoading,
    fetchWithAuth,
  };

  return <DataContext.Provider value={authData}>{children}</DataContext.Provider>;
};

export default function useDataContext() {
  return useContext(DataContext);
}
