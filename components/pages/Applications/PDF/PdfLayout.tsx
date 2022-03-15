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

import { ReactNode } from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { isEqual } from 'lodash';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { PDFLink, styles as commonStyles } from './common';
import { ApplicationDataByField } from '../types';
import { DACO_ROOT } from 'global/constants/externalPaths';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15pt 15pt 15pt 10pt',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    flexDirection: 'column',
  },
  watermarkContainer: {
    top: '47%',
    left: '37%',
    position: 'absolute',
    transform: 'rotate(-45deg)',
  },
  watermark: {
    fontFamily: 'WorkSans',
    fontSize: 48,
    fontWeight: 900,
    color: defaultTheme.colors.accent2,
    opacity: 0.2,
    textTransform: 'uppercase',
  },
  footer: {
    height: '30pt',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20pt',
    lineHeight: 1,
  },
  header: {
    height: '30pt',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    lineHeight: 1,
  },
});

const Watermark = () => (
  <View style={styles.watermarkContainer} fixed>
    <Text style={styles.watermark}>draft</Text>
  </View>
);

const PDFLayout = ({
  applicant,
  appId = '',
  state = 'draft',
  children,
}: {
  applicant?: Partial<ApplicationDataByField>;
  appId?: string;
  state?: string;
  children: ReactNode;
}) => {
  const isDraftState =
    isEqual(state, ApplicationState.DRAFT) || isEqual(state, ApplicationState.REVISIONS_REQUESTED);

  const displayName = `${applicant?.title ? `${applicant.title} ` : ''}${applicant?.displayName}`;
  return (
    <Page style={styles.page} wrap={false}>
      <View style={{ ...commonStyles.text, ...styles.header }} fixed>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />
      </View>
      {isDraftState && <Watermark />}
      <View style={styles.section}>{children}</View>
      <View style={{ ...commonStyles.text, ...styles.footer }} fixed>
        <Text>
          {appId} created for {displayName} by <PDFLink href={DACO_ROOT}>ICGC-DACO</PDFLink>
        </Text>
      </View>
    </Page>
  );
};

export default PDFLayout;
