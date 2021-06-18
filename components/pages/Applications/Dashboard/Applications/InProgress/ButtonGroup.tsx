import { css } from '@emotion/core';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import React from 'react';

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

const getButtonConfig = (state = ''): { content: string; link: string; icon: any }[] => {
  switch (state) {
    case ApplicationState.DRAFT:
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.REVISIONS_REQUESTED:
      return [
        {
          content: 'Edit Application',
          link: '/edit',
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
          link: '',
          icon: icons.file,
        },
      ];
    case ApplicationState.APPROVED:
      return [
        {
          content: 'View Application',
          link: '',
          icon: icons.file,
        },
        {
          content: 'Manage Collaborators',
          link: '',
          icon: icons.user,
        },
      ];
    case ApplicationState.CLOSED:
      [
        {
          content: 'View Application',
          link: '',
          icon: icons.file,
        },
        {
          content: 'Reopen',
          link: '',
          icon: icons.reset,
        },
      ];
  }

  return [];
};

const ButtonGroup = ({ state }: { state: ApplicationState }) => (
  <div
    css={css`
      margin-top: 35px;
      display: flex;

      & .action-btns::not(::first-child) {
        margin-right: 8px;
      }
    `}
  >
    {getButtonConfig(state).map(({ content, link, icon }) => (
      <Link href={link} key={link}>
        <Button className="action-btns" size="sm">
          <span
            css={css`
              margin-right: 3px;
            `}
          >
            {icon}
          </span>
          {content}
        </Button>
      </Link>
    ))}
  </div>
);

export default ButtonGroup;
