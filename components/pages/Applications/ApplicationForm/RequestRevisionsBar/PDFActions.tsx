import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import UploadButton, { pdfValidator } from 'components/UploadButton';
import { API } from 'global/constants';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { DOCUMENT_TYPES } from '../Forms/types';

const PDFActions = () => {
  const theme = useTheme();

  return (
    <>
      <UploadButton
        text="Upload Approved PDF"
        url={`${API.APPLICATIONS}/${999}/assets/${DOCUMENT_TYPES.SIGNED_APP}/upload}`}
        onUpload={(x) => console.log('uploaded', x)}
        onUploadError={(x) => console.log('error upload', x)}
        validators={[pdfValidator]}
      />
      <Button disabled={false} size="sm">
        <span css={instructionBoxButtonContentStyle}>
          <Icon
            css={instructionBoxButtonIconStyle}
            fill={theme.colors.white}
            height="10px"
            name="times"
          />
          Remove approved pdf
        </span>
      </Button>
    </>
  );
};

export default PDFActions;
