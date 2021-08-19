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

import getNextConfig from 'next/config';

export const getConfig = () => {
  const publicConfig: { [k: string]: string } = getNextConfig()?.publicRuntimeConfig || {};
  return {
    NEXT_PUBLIC_EGO_API_ROOT: publicConfig.NEXT_PUBLIC_EGO_API_ROOT || 'http://localhost:8088',
    NEXT_PUBLIC_EGO_CLIENT_ID: publicConfig.NEXT_PUBLIC_EGO_CLIENT_ID || 'dac-ui',
    NEXT_PUBLIC_EGO_PUBLIC_KEY:
      publicConfig.NEXT_PUBLIC_EGO_PUBLIC_KEY ||
      `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lOqMuPLCVusc6szklNXQL1FHhSkEgR7An+8BllBqTsRHM4bRYosseGFCbYPn8r8FsWuMDtxp0CwTyMQR2PCbJ740DdpbE1KC6jAfZxqcBete7gP0tooJtbvnA6X4vNpG4ukhtUoN9DzNOO0eqMU0Rgyy5HjERdYEWkwTNB30i9I+nHFOSj4MGLBSxNlnuo3keeomCRgtimCx+L/K3HNo0QHTG1J7RzLVAchfQT0lu3pUJ8kB+UM6/6NG+fVyysJyRZ9gadsr4gvHHckw8oUBp2tHvqBEkEdY+rt1Mf5jppt7JUV7HAPLB/qR5jhALY2FX/8MN+lPLmb/nLQQichVQIDAQAB\r\n-----END PUBLIC KEY-----`,
    NEXT_PUBLIC_DAC_API_ROOT: publicConfig.NEXT_PUBLIC_DAC_API_ROOT,
    NEXT_PUBLIC_ARGO_ROOT: publicConfig.NEXT_PUBLIC_ARGO_ROOT || 'https://www.icgc-argo.org/',
    NEXT_PUBLIC_ARGO_DOCS_ROOT:
      publicConfig.NEXT_PUBLIC_ARGO_DOCS_ROOT || 'https://docs.icgc-argo.org/',
    NEXT_PUBLIC_ARGO_PLATFORM_ROOT:
      publicConfig.NEXT_PUBLIC_ARGO_PLATFORM_ROOT || 'https://platform.icgc-argo.org',
    USE_DAC_API_PROXY: publicConfig.USE_DAC_API_PROXY === 'true',
    NEXT_PUBLIC_MAINTENANCE_MODE_ON: publicConfig.MAINTENANCE_MODE_ON === 'true',
  } as {
    NEXT_PUBLIC_EGO_API_ROOT: string;
    NEXT_PUBLIC_EGO_CLIENT_ID: string;
    NEXT_PUBLIC_EGO_PUBLIC_KEY: string;
    NEXT_PUBLIC_DAC_API_ROOT: string;
    NEXT_PUBLIC_ARGO_ROOT: string;
    NEXT_PUBLIC_ARGO_DOCS_ROOT: string;
    NEXT_PUBLIC_ARGO_PLATFORM_ROOT: string;
    USE_DAC_API_PROXY: boolean;
    NEXT_PUBLIC_MAINTENANCE_MODE_ON: boolean;
  };
};
