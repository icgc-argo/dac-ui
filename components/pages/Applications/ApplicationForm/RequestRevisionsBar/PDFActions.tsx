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

import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import useTheme from '@icgc-argo/uikit/utils/useTheme';
import { AxiosError } from 'axios';
import UploadButton, { pdfValidator } from 'components/UploadButton';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { useState } from 'react';
import { ApprovedDoc } from '../../types';
import { CustomLoadingButton } from '../Forms/common';
import { DOCUMENT_TYPES } from '../Forms/types';
import { format as formatDate } from 'date-fns';
import { API_DEFAULT_DATE_FORMAT } from '../../Dashboard/Applications/InProgress/constants';

const PDFActions = ({
  appId,
  currentDoc,
  setLastUpdated,
}: {
  appId: string;
  currentDoc: ApprovedDoc;
  setLastUpdated: any;
}) => {
  const theme = useTheme();
  const { fetchWithAuth } = useAuthContext();

  const [isDeleting, setIsDeleting] = useState(false);

  const docId = currentDoc?.approvedAppDocObjId;

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
        const d = formatDate(new Date(), API_DEFAULT_DATE_FORMAT);
        setLastUpdated(d);
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
