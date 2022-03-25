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

import Queue from 'promise-queue';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from '../egoTokenUtils';
import { egoRefreshUrl } from 'global/constants/externalPaths';

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);

const refreshJwt = () =>
  queue.add(async () => {
    // get token from localStorage, not context,
    // in case another tab got a new JWT.
    const storedToken = localStorage.getItem(EGO_JWT_KEY) || '';

    if (!storedToken) {
      console.log('REFRESH no localStorage token');
      return '';
    }

    if (isValidJwt(storedToken)) {
      console.log('REFRESH found valid localStorage token', storedToken.slice(-10));
      localStorage.setItem(EGO_JWT_KEY, storedToken);
      return storedToken;
    }

    console.log('REFRESH no valid localStorage token', storedToken.slice(-10));

    const res = await fetch(egoRefreshUrl, {
      credentials: 'include',
      headers: {
        accept: '*/*',
        authorization: `Bearer ${storedToken}`,
      },
      method: 'POST',
    });
    const newJwt = await res.text();
    if (isValidJwt(newJwt)) {
      console.log('REFRESH valid refreshed token', newJwt.slice(-10));
      localStorage.setItem(EGO_JWT_KEY, newJwt);
    } else {
      throw new Error('Invalid refreshed JWT');
    }

    return newJwt;
  });

export default refreshJwt;
