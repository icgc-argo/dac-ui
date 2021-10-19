import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import { AxiosError } from 'axios';
import UploadButton, { pdfValidator } from 'components/UploadButton';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { useState } from 'react';
import { CustomLoadingButton } from '../Forms/common';
import { DOCUMENT_TYPES } from '../Forms/types';

const PDFActions = ({
  appId,
  doc,
  setLastUpdated,
}: {
  appId: string;
  doc: { approvedAppDocObjId: string };
  setLastUpdated: any;
}) => {
  const theme = useTheme();
  const { fetchWithAuth } = useAuthContext();

  const [isDeleting, setIsDeleting] = useState(false);

  const docId = doc?.approvedAppDocObjId;

  const deleteDocument = (docId: string) => {
    if (!docId) {
      return false;
    }
    setIsDeleting(true);

    fetchWithAuth({
      method: 'DELETE',
      url: `${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.APPROVED_PDF}/assetId/${docId}`,
    })
      .then(() => {
        setIsDeleting(false);
        setLastUpdated(Date.now());
      })
      .catch((err: AxiosError) => {
        console.error('File could not be deleted.', err);
        setIsDeleting(false);
      });
  };

  return (
    <>
      <UploadButton
        text="Upload Approved PDF"
        url={`${API.APPLICATIONS}/${appId}/assets/${DOCUMENT_TYPES.APPROVED_PDF}/upload`}
        onUpload={() => {
          setLastUpdated(Date.now());
        }}
        onUploadError={() => console.log('error upload')}
        validators={[pdfValidator]}
      />
      <Button
        disabled={!docId}
        size="sm"
        onClick={() => {
          deleteDocument(docId);
        }}
        isLoading={isDeleting}
        Loader={(props: any) => <CustomLoadingButton text={'Remove approved pdf'} {...props} />}
      >
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
