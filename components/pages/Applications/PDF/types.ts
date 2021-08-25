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

export enum FieldAccessor {
  DISPLAY_NAME = 'displayName',
  PRIMARY_AFFILIATION = 'primaryAffiliation',
  INSTITUTIONAL_EMAIL = 'institutionEmail',
  GOOGLE_EMAIL = 'googleEmail',
  POSITION_TITLE = 'positionTitle',
  PROJECT_TITLE = 'title',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  SUFFIX = 'suffix',
  TITLE = 'title',
  PUBLICATIONS_URL = 'publicationsURLs',
  BACKGROUND = 'background',
  METHODOLOGY = 'methodology',
  AIMS = 'aims',
  WEBSITE = 'website',
  SUMMARY = 'summary',
}

export enum PdfField {
  NAME = 'NAME',
  PRIMARY_AFFILIATION = 'PRIMARY_AFFILIATION',
  INSTITUTIONAL_EMAIL = 'INSTITUTIONAL_EMAIL',
  GOOGLE_EMAIL = 'GOOGLE_EMAIL',
  RESEARCHER_PROFILE_URL = 'RESEARCHER_PROFILE_URL',
  POSITION_TITLE = 'POSITION_TITLE',
  PURSUING_DEGREE = 'PURSUING_DEGREE',
  PROJECT_TITLE = 'PROJECT_TITLE',
  PROJECT_WEBSITE = 'PROJECT_WEBSITE',
}

export enum PdfFieldName {
  NAME = 'Name',
  PRIMARY_AFFILIATION = 'Primary Affiliation',
  INSTITUTIONAL_EMAIL = 'Institutional Email',
  GOOGLE_EMAIL = 'Google Email',
  RESEARCHER_PROFILE_URL = 'Researcher Profile URL',
  POSITION_TITLE = 'Position Title',
  PURSUING_DEGREE = 'Pursuing Degree',
  PROJECT_TITLE = 'Project Title',
  PROJECT_WEBSITE = 'Project Website',
  PUBLICATION_URL = 'Publication URL',
}

export type PdfFormField = {
  [key in PdfField]: { fieldName: PdfFieldName; fieldKey: FieldAccessor };
};
