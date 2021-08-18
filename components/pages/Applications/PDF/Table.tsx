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

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { styles as commonStyles } from './common';

const styles = StyleSheet.create({
  tableStyle: {
    display: 'flex',
    width: 'auto',
    flexDirection: 'column',
  },
  tableRowStyle: {
    flexDirection: 'row',
  },
  tableColStyle: {
    border: `1pt solid ${defaultTheme.colors.grey_1}`,
    width: '50%',
  },
  tableCellHeaderStyle: {
    fontWeight: 'semibold',
  },
  tableCellStyle: {
    padding: '6pt',
    lineHeight: 1,
  },
});

// needs to be generalized; right now only works for approval letters table
const Table = ({ headers, data }: { headers: { name: string; accessor: string }[]; data: any }) => {
  return (
    <View style={styles.tableStyle}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {headers.map((header: any, i: number) => {
          const lastColumn = i === headers.length - 1;
          return (
            <View
              key={header.accessor}
              style={{
                width: '50%',
                border: `1pt solid ${defaultTheme.colors.grey_1}`,
                ...(data.length > 0 && { borderBottom: 0 }),
                ...(!lastColumn && { borderRight: 0 }),
              }}
            >
              <Text
                style={{
                  ...commonStyles.text,
                  ...styles.tableCellStyle,
                  ...styles.tableCellHeaderStyle,
                }}
              >
                {header.name}
              </Text>
            </View>
          );
        })}
      </View>
      {data.map((cell: any, i: number) => {
        const isLastItem = i === data.length - 1;
        return (
          <View key={cell.objectId} style={{ display: 'flex', flexDirection: 'row' }}>
            <View
              style={{
                width: '50%',
                border: `1pt solid ${defaultTheme.colors.grey_1}`,
                borderRight: 0,
                borderBottom: 0,
                ...(isLastItem && { borderBottom: `1pt solid ${defaultTheme.colors.grey_1}` }),
              }}
            >
              <Text style={{ ...commonStyles.text, ...styles.tableCellStyle }}>{cell.name}</Text>
            </View>
            <View
              style={{
                width: '50%',
                border: `1pt solid ${defaultTheme.colors.grey_1}`,
                borderBottom: 0,
                ...(isLastItem && { borderBottom: `1pt solid ${defaultTheme.colors.grey_1}` }),
              }}
            >
              <Text style={{ ...commonStyles.text, ...styles.tableCellStyle }}>
                {cell.uploadedAtUtc}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Table;
