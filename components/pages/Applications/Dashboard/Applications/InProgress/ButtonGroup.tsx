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
};

const getButtonConfig = (appId = '', state = ''): { content: string; link: string; icon: any }[] => {
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
      margin-top: 35px;
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
            margin-left: ${index ? '8px !important;' : 0}
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
