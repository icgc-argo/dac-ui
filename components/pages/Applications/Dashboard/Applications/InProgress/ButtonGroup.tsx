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

import { Fragment } from 'react';
import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import router from 'next/router';
import { APPLICATIONS_PATH } from 'global/constants';
import urlJoin from 'url-join';

const icons = {
  file: <Icon fill="white" height="12px" width="9px" name="file" />,
  edit: (
    <Icon
      css={css`
        position: relative;
        top: 2px;
      `}
      fill="white"
      height="12px"
      width="12px"
      name="edit"
    />
  ),
  user: <Icon fill="white" height="12px" width="12px" name="user" />,
  reset: <Icon fill="white" height="12px" width="10px" name="reset" />,
  calendar: <Icon fill="white" height="12px" width="9px" name="calendar" />,
};

const getButtonConfig = (
  appId = '',
  state = '',
): { content: string; link: string; icon: any }[] => {
  const link = urlJoin(APPLICATIONS_PATH, appId);
  switch (state) {
    case ApplicationState.DRAFT:
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.REVISIONS_REQUESTED:
      return [
        {
          content: 'Edit Application',
          link,
          icon: icons.edit,
        },
      ];
    case ApplicationState.REVIEW:
    case ApplicationState.REJECTED:
    // closed after approval
    case ApplicationState.CLOSED:
      return [
        {
          content: 'View Application',
          link,
          icon: icons.file,
        },
      ];
    case ApplicationState.APPROVED:
      return [
        {
          content: 'View Application',
          link,
          icon: icons.file,
        },
        {
          content: 'Manage Collaborators',
          link: urlJoin(link, '?section=collaborators'),
          icon: icons.user,
        },
      ];

      case ApplicationState.PAUSED:
        return [
          {
            content: 'Complete Attestation',
            link,
            icon: icons.calendar,
          },
        ];

    case ApplicationState.CLOSED:
      [
        {
          content: 'View Application',
          link,
          icon: icons.file,
        },
        {
          content: 'Reopen',
          link,
          icon: icons.reset,
        },
      ];
  }

  return [];
};

const ButtonGroup = ({ appId, state }: { appId: string; state: ApplicationState }) => (
  <div
    css={css`
      display: flex;
    `}
  >
    {getButtonConfig(appId, state).map(({ content, link, icon }, index) => (
      <Fragment key={link}>
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
            {icon}
          </span>
          {content}
        </Button>
      </Fragment>
    ))}
  </div>
);

export default ButtonGroup;
