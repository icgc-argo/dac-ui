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

import { ModalPortal } from 'components/Root';
import RequestRevisionsModal from './RequestRevisionsModal';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import ActionBar from './ActionBar';
import ApplicationActions from './ApplicationActions';
import { useState } from 'react';
import PDFActions from './PDFActions';
import { ApplicationData } from '../../types';
import { SetLastUpdated } from '../types';
import { VisibleModalOption } from './types';

const RequestRevisionsBar = ({
  data,
  setLastUpdated,
}: {
  data: ApplicationData;
  setLastUpdated: SetLastUpdated;
}) => {
  const [visibleModal, setVisibleModal] = useState<VisibleModalOption>(VisibleModalOption.NONE);
  const {
    appId,
    sections: { applicant: { info: { primaryAffiliation = '' } = {} } = {} },
    state,
    approvedAppDocs,
  } = data;

  const applicationActionsDisabled = [
    ApplicationState.APPROVED,
    ApplicationState.REVISIONS_REQUESTED,
    ApplicationState.REJECTED,
    ApplicationState.CLOSED,
  ].includes(state);

  const isApproved = ApplicationState.APPROVED === state;

  const currentApprovedDoc = approvedAppDocs.find((doc) => doc.isCurrent);

  return (
    <>
      {visibleModal === VisibleModalOption.REVISIONS && (
        <ModalPortal>
          <RequestRevisionsModal
            appId={appId}
            dismissModal={() => setVisibleModal(VisibleModalOption.NONE)}
          />
        </ModalPortal>
      )}
      {visibleModal === VisibleModalOption.APPROVAL && (
        <ModalPortal>
          <ApproveModal
            appId={appId}
            dismissModal={() => setVisibleModal(VisibleModalOption.NONE)}
            primaryAffiliation={primaryAffiliation}
          />
        </ModalPortal>
      )}
      {visibleModal === VisibleModalOption.REJECTION && (
        <ModalPortal>
          <RejectModal
            appId={appId}
            dismissModal={() => setVisibleModal(VisibleModalOption.NONE)}
            primaryAffiliation={primaryAffiliation}
          />
        </ModalPortal>
      )}
      <ActionBar>
        {isApproved ? (
          <PDFActions
            appId={appId}
            currentDoc={currentApprovedDoc}
            setLastUpdated={setLastUpdated}
          />
        ) : (
          <ApplicationActions
            disabled={applicationActionsDisabled}
            setVisibleModal={setVisibleModal}
          />
        )}
      </ActionBar>
    </>
  );
};

export default RequestRevisionsBar;
