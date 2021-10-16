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

import { ReactElement } from 'react';
import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import { ModalPortal } from 'components/Root';
import { useRouter } from 'next/router';

import { EGO_LOGIN_URL } from 'global/constants';

const ApplyForAccessModal = ({
  dismissModal,
}: {
  dismissModal: () => any | void;
}): ReactElement => {
  const router = useRouter();

  return (
    <ModalPortal>
      <Modal
        title="Apply for Access"
        onActionClick={() => router.push(EGO_LOGIN_URL)}
        onCancelClick={dismissModal}
        onCloseClick={dismissModal}
        actionButtonText="Login with Google"
        actionButtonId="modal-action-btn_google-logo"
      >
        <Typography>
          For authorization, we require a valid Google email address (Gmail or GSuite). This will be
          the email address you will use to log in to ICGC DACO, ICGC ARGO, and ICGC 25K and will be
          the email address associated with ICGC Controlled Data Access.
        </Typography>
      </Modal>
    </ModalPortal>
  );
};

export default ApplyForAccessModal;
