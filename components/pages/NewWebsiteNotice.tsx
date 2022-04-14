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

import Typography from '@icgc-argo/uikit/Typography';
import { ThemeProvider } from '@icgc-argo/uikit';
import { css } from '@icgc-argo/uikit';
import Container from '@icgc-argo/uikit/Container';

import Head, { PageHead } from 'components/Head';
import icgcDacoLogo from '../../public/icgc-daco-logo.svg';
import argoLogo from '../../public/stacked-argo-logo.svg';
import icgc25kLogo from '../../public/icgc-25k-full-logo.svg';
import Link from '@icgc-argo/uikit/Link';
import { CONTACT_PAGE, DACO_ROOT, ICGC_DCC_LINK } from 'global/constants';
import { getConfig } from 'global/config';
import Button from '@icgc-argo/uikit/Button';

const NewWebsiteNotice = () => {
  const { NEXT_PUBLIC_ARGO_ROOT } = getConfig();
  return (
    <>
      <Head />
      <ThemeProvider>
        <PageHead title="ICGC DACO - Notice of New Website" />
        <Container
          css={css`
            margin: 40px 19% 50px;
            padding: 31px 46px 14px 54px;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              padding-bottom: 30px;
            `}
          >
            <Link target="_blank" href={DACO_ROOT}>
              <img src={icgcDacoLogo} alt="ICGC-DACO logo" width={300} height={44} />
            </Link>
          </div>
          <div
            css={(theme) =>
              css`
                border-top: 1px solid ${theme.colors.grey_2};
                border-bottom: 1px solid ${theme.colors.grey_2};
                padding-bottom: 31px;
              `
            }
          >
            <Typography
              variant="subtitle"
              css={(theme) =>
                css`
                  color: ${theme.colors.primary};
                `
              }
            >
              Notice of New Website
            </Typography>
            <Typography
              css={css`
                padding-bottom: 10px;
              `}
            >
              The <strong>ICGC Data Access Compliance Office (ICGC DACO)</strong> is pleased to
              announce the launch of a new website to manage Applications for Access to ICGC
              Controlled Data. The old website, daco.icgc.org has been retired and replaced with a
              new and improved website,{' '}
              <Link target="_blank" href={DACO_ROOT}>
                daco.icgc-argo.org
              </Link>
              .
            </Typography>
            <Typography
              variant="subtitle"
              css={(theme) =>
                css`
                  color: ${theme.colors.primary};
                `
              }
            >
              Instructions for Current Users
            </Typography>
            <Typography
              css={css`
                padding-bottom: 10px;
              `}
            >
              If you currently have an approved application, you will continue to have access to
              ICGC Controlled Data until the date of expiry. You will not be able to access your
              current application online; however, we will need your help migrating your project
              team and project information over to the new website. At your earliest convenience,
              please use the approved pdf copy that was emailed to you from the ICGC DACO and copy
              the content from your old application to a new application on{' '}
              <Link target="_blank" href={DACO_ROOT}>
                daco.icgc-argo.org
              </Link>
              . When you submit the signed new application, the ICGC DACO will review and grant your
              project team <strong>2 years of access to ICGC Controlled Data</strong>. If you have
              any questions, please{' '}
              <Link target="_blank" href={CONTACT_PAGE}>
                contact the ICGC DACO
              </Link>
              .
            </Typography>
            <Typography
              variant="subtitle"
              css={(theme) =>
                css`
                  color: ${theme.colors.primary};
                `
              }
            >
              Instructions for New Users
            </Typography>
            <Typography
              css={css`
                padding-bottom: 10px;
              `}
            >
              If you haven't filled out a DACO Application before, but would like to gain access to
              ICGC Controlled Data for your project team, please proceed to{' '}
              <Link target="_blank" href={DACO_ROOT}>
                daco.icgc-argo.org
              </Link>{' '}
              and click the <strong>Get Started: Apply for Access</strong> button.{' '}
            </Typography>
            <Link
              target="_blank"
              href={DACO_ROOT}
              css={css`
                text-decoration: none;
              `}
            >
              <Button>Proceed to daco.icgc-argo.org</Button>
            </Link>
          </div>
          <div
            css={css`
              display: flex;
              justify-content: center;
              padding-top: 10px;
            `}
          >
            <div
              css={css`
                margin-right: 20px;
              `}
            >
              <Link target="_blank" href={NEXT_PUBLIC_ARGO_ROOT}>
                <img src={argoLogo} width={150} height={59} />
              </Link>
            </div>
            <div
              css={css`
                margin-left: 20px;
              `}
            >
              <Link target="_blank" href={ICGC_DCC_LINK}>
                <img src={icgc25kLogo} width={150} height={49} />
              </Link>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default NewWebsiteNotice;
