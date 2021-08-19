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

import Progress, { ProgressItem as ProgressItemDefault } from '@icgc-argo/uikit/Progress';
import { styled } from '@icgc-argo/uikit';
import { ApplicationState, ProgressStates } from './types';

const ProgressItem = styled(ProgressItemDefault)`
  min-width: 100px;
`;

const defaultProgressItems = [
  { label: 'Draft', state: 'disabled', completed: false },
  { label: 'Sign & Submit', state: 'disabled', completed: false },
  { label: 'Daco Review', state: 'disabled', completed: false },
];

enum PROGRESS_LABELS {
  DACO_REVIEW = 'DACO Review',
  DRAFT = 'Draft',
  SIGN_AND_SUBMIT = 'Sign & Submit',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED = 'Closed',
  REVISIONS_REQUESTED = 'Revisions Requested',
}

const progressStates: ProgressStates = {
  [ApplicationState.DRAFT]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'disabled', completed: false },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.SIGN_AND_SUBMIT]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.REVIEW]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'pending', completed: true },
  ],
  [ApplicationState.APPROVED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.APPROVED, state: 'success', completed: true },
  ],
  [ApplicationState.REVISIONS_REQUESTED]: [
    { label: PROGRESS_LABELS.REVISIONS_REQUESTED, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'disabled', completed: false },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.REJECTED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.REJECTED, state: 'closed', completed: true },
  ],
  [ApplicationState.CLOSED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
  [ApplicationState.EXPIRED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'locked', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
  [ApplicationState.RENEWING]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
};

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => {
  const progressItems = state ? progressStates[state] : defaultProgressItems;
  return (
    <div>
      <Progress>
        {progressItems.map(({ label, state, completed }, i) => (
          <ProgressItem key={i} text={label} state={state} completed={completed} />
        ))}
      </Progress>
    </div>
  );
};

export default ApplicationProgressBar;
