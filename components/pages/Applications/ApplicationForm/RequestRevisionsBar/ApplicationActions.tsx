import css from '@emotion/css';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { VisibleModalOption } from '.';

const ApplicationActions = ({
  disabled,
  setVisibleModal,
}: {
  disabled: boolean;
  setVisibleModal: any;
}) => {
  const theme = useTheme();
  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.APPROVAL);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={css`
              margin-right: 1px;
              margin-left: -4px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="checkmark"
          />
          Approve
        </span>
      </Button>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.REVISIONS);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={instructionBoxButtonIconStyle}
            fill={theme.colors.white}
            height="9px"
            name="edit"
          />
          Request Revisions
        </span>
      </Button>
      <Button
        disabled={disabled}
        onClick={() => {
          setVisibleModal(VisibleModalOption.REJECTION);
        }}
        size="sm"
      >
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={instructionBoxButtonIconStyle}
            fill={theme.colors.white}
            height="10px"
            name="times"
          />
          Reject
        </span>
      </Button>
    </>
  );
};

export default ApplicationActions;
