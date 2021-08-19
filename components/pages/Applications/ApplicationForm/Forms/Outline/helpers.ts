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

import { FORM_STATES } from '../types';

import { FormSectionOverallState, TAG_VARIANTS, ValidationConfigType } from '../types';

// <Tag> colour reference:
//   DISABLED: #a1a4b1
//   ERROR: #df1b42
//   HIGHLIGHT: #9bc7ed
//   INFO: #0774d3
//   NEUTRAL: #  #dcdde1
//   SUCCESS: #00C79D
//   UPDATE: #00b3d3
//   WARNING: #fea430
//   EDITABLE: #7f55cc

export const getValidationUIConfig = (status: FormSectionOverallState): ValidationConfigType => {
  switch (status) {
    case FORM_STATES.COMPLETE:
      return {
        iconName: 'checkmark',
        tagVariant: TAG_VARIANTS.SUCCESS,
      };

    case FORM_STATES.INCOMPLETE:
      return {
        iconName: 'exclamation',
        tagVariant: TAG_VARIANTS.ERROR,
      };

    case FORM_STATES.CAN_EDIT:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.EDITABLE,
      };

    case FORM_STATES.MUST_EDIT:
    case FORM_STATES.REVISIONS_REQUESTED_DISABLED:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.WARNING,
      };

    case FORM_STATES.LOCKED:
      return {
        iconName: 'lock',
        tagVariant: TAG_VARIANTS.DISABLED,
      };

    case FORM_STATES.REVISIONS_MADE:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.SUCCESS,
      };

    default:
      return {
        iconName: 'question',
        tagVariant: TAG_VARIANTS.NEUTRAL,
      };
  }
};
