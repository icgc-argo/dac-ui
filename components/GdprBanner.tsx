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

import React from 'react';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { css } from '@emotion/core';
import Icon from '@icgc-argo/uikit/Icon';
import Typography from '@icgc-argo/uikit/Typography';
import Button from '@icgc-argo/uikit/Button';
import Link from '@icgc-argo/uikit/Link';
import HyperLink from '@icgc-argo/uikit/Link';

import { PRIVACY_POLICY_PAGE } from '../global/constants/externalPaths';
import { GDPR_ACCEPTED } from 'global/constants';

const GdprBanner = () => {
  const theme = useTheme();
  const [accepted, setAcceptedState] = React.useState(true);
  const sync = () => {
    setAcceptedState(localStorage.getItem(GDPR_ACCEPTED) === 'true');
  };
  const persistAcceptedState = (accepted: boolean) => {
    localStorage.setItem(GDPR_ACCEPTED, String(accepted));
    sync();
  };
  React.useEffect(() => {
    sync();
  }, []);
  return (
    <>
      {!accepted && (
        <div
          css={css`
            background: ${theme.colors.primary_dark};
            color: ${theme.colors.white};
            display: flex;
            padding: 8px 4px;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              padding: 16px;
              padding-left: 8px;
            `}
          >
            <Icon name="info" fill={theme.colors.secondary} width="30px" height="30px" />
          </div>
          <Typography as="div">
            This website uses cookies that are required to verify permissions, access controlled
            data, and analyze traffic. Your browser settings may allow you to turn off cookies. If
            you turn off browser cookies, you will not be able to access some features of the ICGC
            DACO website. By continuing to use our website without changing your browser settings,
            you consent to our use of cookies in accordance with our Privacy Policy. To learn more
            about how we use cookies on this website, please review our{' '}
            <Link href={PRIVACY_POLICY_PAGE} target="_blank">
              <HyperLink invert>Privacy Policy</HyperLink>
            </Link>
            .
          </Typography>
          <div
            css={css`
              display: flex;
              align-items: center;
              padding: 15px;
            `}
          >
            <Button variant="secondary" onClick={() => persistAcceptedState(true)}>
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default GdprBanner;
