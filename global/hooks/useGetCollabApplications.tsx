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

import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse, Method } from 'axios';
import useAuthContext from './useAuthContext';
import { API } from 'global/constants/externalPaths';

const useGetCollabApplications = () => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { fetchWithAuth, isLoading: isTokenLoading, token } = useAuthContext();

  useEffect(() => {
    if (token && !isTokenLoading) {
      fetchWithAuth({
        method: 'GET' as Method,
        url: API.COLLABORATOR_APPS,
      })
        .then((res: AxiosResponse) => {
          setResponse(res);
        })
        .catch((err: AxiosError) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return { error, isLoading, response };
};

export default useGetCollabApplications;
