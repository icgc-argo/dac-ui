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

import { useState } from 'react';
import { AxiosError } from 'axios';
import urlJoin from 'url-join';
import { css } from '@emotion/core';
import router from 'next/router';

import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Textarea from '@icgc-argo/uikit/form/Textarea';

import { useAuthContext } from 'global/hooks';
import { API } from 'global/constants';

const RejectModal = ({
  appId,
  dismissModal,
  primaryAffiliation,
}: {
  appId: string;
  dismissModal: () => any | void;
  primaryAffiliation: string;
}) => {
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [denialReason, setDenialReason] = useState<string>('');
  const { fetchWithAuth } = useAuthContext();

  const submitRejection = () => {
    setIsLoading(true);
    fetchWithAuth({
      data: {
        state: 'REJECTED',
        denialReason,
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then(() => {
        router.reload();
      })
      .catch((err: AxiosError) => {
        setIsLoading(false);
        setError(err);
      });
  };

  return (
    <Modal
      actionButtonText={isLoading ? 'Loading' : 'Reject'}
      actionDisabled={isLoading}
      buttonSize="sm"
      cancelText="Cancel"
      onActionClick={() => submitRejection()}
      onCancelClick={dismissModal}
      onCloseClick={dismissModal}
      title="Are you sure you want to REJECT this application?"
    >
      <Typography>
        Are you sure you want to reject{' '}
        <strong>
          Application: {appId} ({primaryAffiliation})?
        </strong>{' '}
        If so, the applicant will be notified and will be unable to reopen this application.
      </Typography>

      <FormControl>
        <InputLabel htmlFor="denialReason">Details from the ICGC DACO Team (optional):</InputLabel>
        <Textarea
          aria-label="Details from the ICGC DACO Team (optional)"
          id="denialReason"
          onChange={(e: any) => setDenialReason(e.target.value)}
          rows={6}
          value={denialReason}
        />
      </FormControl>

      <FormControl error={!!error}>
        <FormHelperText
          css={css`
            margin-left: 0;
          `}
          onErrorOnly
        >
          Something went wrong. Please try again.
        </FormHelperText>
      </FormControl>
    </Modal>
  );
};

export default RejectModal;
