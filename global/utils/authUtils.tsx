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

import urlJoin from 'url-join';
import Queue from 'promise-queue';

import { isValidJwt } from 'global/utils/egoTokenUtils';
import { getConfig } from 'global/config';
import { EGO_JWT_KEY } from 'global/constants';
import { egoRefreshUrl } from 'global/constants/externalPaths';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

export const getStoredJwt = (): string => localStorage.getItem(EGO_JWT_KEY) || '';
export const removeStoredJwt = () => {
  localStorage.removeItem(EGO_JWT_KEY);
};
export const setStoredJwt = (token: string) => {
  localStorage.setItem(EGO_JWT_KEY, token);
};

export const fetchEgoJwt = async (): Promise<string> => {
  console.log('logged in, get JWT from Ego');
  const egoLoginUrl = urlJoin(
    NEXT_PUBLIC_EGO_API_ROOT,
    `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
  );

  const res = await fetch(egoLoginUrl, {
    credentials: 'include',
    headers: { accept: '*/*' },
    body: null,
    method: 'POST',
  });
  if (res.status !== 200) {
    throw new Error();
  }
  return await res.text();
};

const refreshMaxConcurrent = 1;
const refreshMaxQueue = 1;
const refreshQueue = new Queue(refreshMaxConcurrent, refreshMaxQueue);

export const refreshJwt = () =>
  refreshQueue.add(
    async (): Promise<string> => {
      // get token from localStorage, not context,
      // in case another tab got a new JWT.
      const storedJwt = getStoredJwt();

      if (!storedJwt) {
        console.log('REFRESH - no localStorage token');
        return '';
      }

      if (isValidJwt(storedJwt)) {
        console.log('REFRESH - found valid localStorage JWT:', storedJwt.slice(-10));
        localStorage.setItem(EGO_JWT_KEY, storedJwt);
        return storedJwt;
      }

      console.log('REFRESH - no valid localStorage JWT:', storedJwt.slice(-10));

      const refreshedJwt = await fetch(egoRefreshUrl, {
        credentials: 'include',
        headers: {
          accept: '*/*',
          authorization: `Bearer ${storedJwt}`,
        },
        method: 'POST',
      }).then((res) => {
        console.log('refresh res', res);
        return res.text();
      });

      return refreshedJwt || '';
    },
  );
