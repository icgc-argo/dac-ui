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
import { add, format } from 'date-fns';
import { css } from '@emotion/core';
import router from 'next/router';

import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';

import { useAuthContext } from 'global/hooks';
import { API, DATE_TEXT_FORMAT } from 'global/constants';

const ApproveModal = ({
  appId,
  dismissModal,
  primaryAffiliation,
}: {
  appId: string;
  dismissModal: () => any | void;
  primaryAffiliation: string;
}) => {
  const currentDate = new Date();
  const startDate = format(currentDate, DATE_TEXT_FORMAT);
  const endDate = format(add(currentDate, { years: 2 }), DATE_TEXT_FORMAT);

  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchWithAuth } = useAuthContext();

  const submitApproval = () => {
    setIsLoading(true);
    fetchWithAuth({
      data: {
        state: 'APPROVED',
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
      actionButtonText={isLoading ? 'Loading' : 'Approve for Access'}
      actionDisabled={isLoading}
      buttonSize="sm"
      cancelText="Cancel"
      onActionClick={() => submitApproval()}
      onCancelClick={dismissModal}
      onCloseClick={dismissModal}
      title="Are you sure you want to APPROVE the application?"
    >
      <Typography>
        Are you sure you want to approve{' '}
        <strong>
          Application: {appId} ({primaryAffiliation})?
        </strong>
      </Typography>
      <Typography>
        If so, the applicant and collaborators will be notified and will receive access to ICGC
        Controlled Data for the following time period:
      </Typography>
      <Typography>
        <strong>Start Date:</strong> {startDate} &nbsp; | &nbsp; <strong>End Date:</strong>{' '}
        {endDate}
      </Typography>
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

export default ApproveModal;
