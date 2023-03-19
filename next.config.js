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

const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withTranspileModules = require('next-transpile-modules')(['@icgc-argo/uikit']);

const USE_DAC_API_PROXY = process.env.USE_DAC_API_PROXY === 'true';

module.exports = withPlugins([withTranspileModules, [withImages], [withFonts]], {
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return process.env.EXPORT_PATH
      ? {
          '/': { page: process.env.EXPORT_PATH },
          '/404': { page: process.env.EXPORT_PATH },
        }
      : defaultPathMap;
  },
  inlineImageLimit: 10240,
  publicRuntimeConfig: {
    NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
    NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
    NEXT_PUBLIC_EGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_EGO_PUBLIC_KEY,
    NEXT_PUBLIC_DAC_API_ROOT: USE_DAC_API_PROXY ? '/api/' : process.env.NEXT_PUBLIC_DAC_API_ROOT,
    NEXT_PUBLIC_ARGO_ROOT: process.env.NEXT_PUBLIC_ARGO_ROOT,
    NEXT_PUBLIC_ARGO_DOCS_ROOT: process.env.NEXT_PUBLIC_ARGO_DOCS_ROOT,
    NEXT_PUBLIC_ARGO_PLATFORM_ROOT: process.env.NEXT_PUBLIC_ARGO_PLATFORM_ROOT,
    NEXT_PUBLIC_DACO_ROOT: process.env.NEXT_PUBLIC_DACO_ROOT,
    NEXT_PUBLIC_MAINTENANCE_MODE_ON: process.env.NEXT_PUBLIC_MAINTENANCE_MODE_ON,
    NEXT_PUBLIC_DACO_SURVEY_URL: process.env.NEXT_PUBLIC_DACO_SURVEY_URL,
    NEXT_PUBLIC_DACO_EMAIL_ADDRESS: process.env.NEXT_PUBLIC_DACO_EMAIL_ADDRESS,
    NEXT_PUBLIC_DAYS_POST_EXPIRY: process.env.NEXT_PUBLIC_DAYS_POST_EXPIRY,
  },
  ...(USE_DAC_API_PROXY
    ? {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: `${process.env.NEXT_PUBLIC_DAC_API_ROOT}/:path*`, // Proxy to Backend
            },
          ];
        },
      }
    : {}),
});
