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

import { Fragment, ReactNode } from 'react';
import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import router from 'next/router';
import { API, APPLICATIONS_PATH, RENEWAL_PATH } from 'global/constants';
import urlJoin from 'url-join';
import { UikitIconNames } from '@icgc-argo/uikit/Icon/icons';
import { useAuthContext } from 'global/hooks';
import { AxiosResponse } from 'axios';
import { ApplicationData } from 'components/pages/Applications/types';
import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';
import { useToaster } from 'global/hooks/useToaster';

const ButtonIcon = ({ name }: { name: UikitIconNames }) => {
  return (
    <Icon
      css={css`
        margin-bottom: -2px;
      `}
      fill="white"
      height="12px"
      name={name}
    />
  );
};

export const RenewButton = ({
  children,
  appId,
  link,
  icon = 'reset',
}: {
  children: ReactNode;
  appId: string;
  link: string;
  icon?: UikitIconNames;
}): JSX.Element => {
  const { fetchWithAuth } = useAuthContext();
  const toaster = useToaster();
  return (
    <Button
      className="action-btns"
      size="sm"
      onClick={async () => {
        await fetchWithAuth({
          url: link,
          method: 'POST',
        })
          .then(async (res: AxiosResponse) => {
            if (res.status === 201) {
              const appData: ApplicationData = res.data;
              router.push(urlJoin(APPLICATIONS_PATH, appData.appId, '?section=terms'));
            }
          })
          .catch((err: Error) => {
            toaster.addToast({
              variant: TOAST_VARIANTS.ERROR,
              title: 'Renewal Failed',
              content: `There was an error while trying to create a renewal application for ${appId}. Please try again later.`,
              interactionType: 'CLOSE',
            });
          });
      }}
    >
      <span
        css={css`
          margin-right: 3px;
        `}
      >
        <Icon
          name={icon}
          fill="white"
          height="12px"
          css={css`
            margin-bottom: -2px;
            margin-right: 2px;
            transform: scaleX(-1);
          `}
        />
      </span>
      {children}
    </Button>
  );
};

const getButtonConfig = (
  appId: string = '',
  state: ApplicationState,
  requiresAttestation: boolean = false,
  ableToRenew: boolean,
): {
  content: string;
  link: string;
  icon: UikitIconNames;
  CustomButton?: (props: any) => JSX.Element;
}[] => {
  const link = urlJoin(APPLICATIONS_PATH, appId);
  switch (state) {
    case ApplicationState.DRAFT:
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.REVISIONS_REQUESTED:
      return [
        {
          content: 'Edit Application',
          link,
          icon: 'edit',
        },
      ];
    case ApplicationState.REVIEW:
    case ApplicationState.REJECTED:
    case ApplicationState.CLOSED:
      return [
        {
          content: 'View Application',
          link,
          icon: 'file',
        },
      ];
    case ApplicationState.APPROVED:
      return requiresAttestation
        ? [
            {
              content: 'Complete Attestation',
              link,
              icon: 'calendar',
            },
          ]
        : ableToRenew
        ? [
            {
              content: 'Renew Application',
              CustomButton: RenewButton,
              icon: 'reset',
              link: urlJoin(API.APPLICATIONS, appId, RENEWAL_PATH),
            },
            {
              content: 'View Application',
              link,
              icon: 'file',
            },
          ]
        : [
            {
              content: 'View Application',
              link,
              icon: 'file',
            },
            {
              content: 'Manage Collaborators',
              link: urlJoin(link, '?section=collaborators'),
              icon: 'user',
            },
          ];
    case ApplicationState.EXPIRED:
      return ableToRenew
        ? [
            {
              content: 'Renew Application',
              CustomButton: RenewButton,
              icon: 'reset',
              link: urlJoin(API.APPLICATIONS, appId, RENEWAL_PATH),
            },
            {
              content: 'View Application',
              link,
              icon: 'file',
            },
          ]
        : [
            {
              content: 'View Application',
              link,
              icon: 'file',
            },
          ];
      break;
    // Paused state implies attestation is needed
    case ApplicationState.PAUSED:
      return ableToRenew
        ? [
            {
              content: 'Complete Attestation',
              link,
              icon: 'calendar',
            },
            {
              content: 'Renew Application',
              CustomButton: RenewButton,
              icon: 'reset',
              link: urlJoin(API.APPLICATIONS, appId, RENEWAL_PATH),
            },
          ]
        : [
            {
              content: 'Complete Attestation',
              link,
              icon: 'calendar',
            },
          ];
    default:
      return [];
  }
};

const ButtonGroup = ({
  appId,
  state,
  requiresAttestation,
  ableToRenew,
}: {
  appId: string;
  state: ApplicationState;
  requiresAttestation: boolean;
  ableToRenew: boolean;
}) => (
  <div
    css={css`
      display: flex;
    `}
  >
    {getButtonConfig(appId, state, requiresAttestation, ableToRenew).map(
      ({ content, link, icon, CustomButton }, index) => (
        <Fragment key={link}>
          {CustomButton ? (
            <CustomButton appId={appId} link={link} icon={icon}>
              {content}
            </CustomButton>
          ) : (
            <Button
              className="action-btns"
              size="sm"
              onClick={() => router.push(link)}
              css={css`
                margin-left: ${index ? '8px !important;' : 0};
              `}
            >
              <span
                css={css`
                  margin-right: 3px;
                `}
              >
                <ButtonIcon name={icon} />
              </span>
              {content}
            </Button>
          )}
        </Fragment>
      ),
    )}
  </div>
);

export default ButtonGroup;
