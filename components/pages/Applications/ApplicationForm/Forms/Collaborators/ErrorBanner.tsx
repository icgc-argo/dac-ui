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

import Banner from '@icgc-argo/uikit/notifications/Banner';

const TITLE_COLLABORATOR_NOT_ADDED = 'Collaborator could not be added';
const TITLE_GENERIC_ERROR = 'Something went wrong';

export enum AddCollaboratorError {
  CollaboratorExists = 'CollaboratorExists',
  CollaboratorIsApplicant = 'CollaboratorIsApplicant',
  GenericError = 'GenericError',
}

export enum CollaboratorErrorCodes {
  COLLABORATOR_EXISTS = 'COLLABORATOR_EXISTS',
  COLLABORATOR_SAME_AS_APPLICANT = 'COLLABORATOR_SAME_AS_APPLICANT',
}

const getErrorContent = (error: keyof typeof AddCollaboratorError) => {
  switch (error) {
    case AddCollaboratorError.CollaboratorExists:
      return {
        title: TITLE_COLLABORATOR_NOT_ADDED,
        content: 'The collaborator has already been added to your application.',
      };
    case AddCollaboratorError.CollaboratorIsApplicant:
      return {
        title: TITLE_COLLABORATOR_NOT_ADDED,
        content: 'The applicant does not need to be added as a collaborator.',
      };
    case AddCollaboratorError.GenericError:
      return {
        title: TITLE_GENERIC_ERROR,
        content: 'Your action could not be completed please try again.',
      };
  }
};

const ErrorBanner = ({ error }: { error: keyof typeof AddCollaboratorError }) => (
  <Banner variant="ERROR" {...getErrorContent(error)} />
);

export default ErrorBanner;
