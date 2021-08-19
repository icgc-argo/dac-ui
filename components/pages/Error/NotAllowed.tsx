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

import ErrorLayout from '.';
import { getConfig } from 'global/config';
import { Row, Col } from 'react-grid-system';
import Image from 'next/image';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import Link from '@icgc-argo/uikit/Link';

export default function NotAllowed() {
  const { NEXT_PUBLIC_ARGO_DOCS_ROOT = '' } = getConfig();
  return (
    <ErrorLayout>
      <Row
        nogutter
        css={css`
          padding: 32px;
        `}
      >
        <Col sm={12} md={6}>
          <Typography
            css={css`
              font-size: 100px;
              margin: 0;
              font-weight: 600;
              line-height: normal;
            `}
          >
            4
            <Image
              css={css`
                margin: 0 8px -2px;
              `}
              alt="Logo mark"
              src="/logomark.svg"
              width="70"
              height="71"
            />
            3
          </Typography>
          <Typography as="h2" variant="subtitle" color="secondary">
            Forbidden
          </Typography>
          <Typography
            variant="subtitle2"
            css={css`
              margin: 33px 0;
            `}
          >
            You do not have permission to access this page.
          </Typography>
          <Typography variant="subtitle2">
            Check out our{' '}
            <Link target="_blank" href={NEXT_PUBLIC_ARGO_DOCS_ROOT}>
              Documentation
            </Link>{' '}
            or head back <Link href="/">Home</Link>.
          </Typography>
        </Col>
        <Col
          sm={12}
          md={6}
          css={css`
            text-align: center;
          `}
        >
          <Image alt="Broken dna" src="/dna-broken.svg" width="276" height="300" />
        </Col>
      </Row>
    </ErrorLayout>
  );
}
