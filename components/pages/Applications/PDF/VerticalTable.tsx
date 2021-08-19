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

import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import { PdfFieldName } from './types';
import { styles as commonStyles } from './common';

const styles = StyleSheet.create({
  tableStyle: {
    display: 'flex',
    width: 'auto',
    lineHeight: 1,
  },
  tableRowStyle: {
    flexDirection: 'row',
  },
  tableCellHeaderStyle: {
    fontWeight: 'semibold',
    marginRight: '10pt',
  },
  tableCellStyle: {
    padding: '6pt 0',
  },
});

const borderedTableStyles = StyleSheet.create({
  table: {
    border: `1pt solid ${defaultTheme.colors.grey_1}`,
  },
  theader: {
    paddingLeft: '15pt',
  },
});

const TableRow = ({
  headerName = '',
  value = '',
  headerCellWidth,
  valueCellWidth,
  hasBottomBorder,
  useExternalBorders,
}: {
  headerName?: string;
  value?: string | React.ReactElement;
  headerCellWidth: number;
  valueCellWidth: number;
  hasBottomBorder: boolean;
  useExternalBorders: boolean;
}): ReactElement => {
  return (
    <View style={styles.tableRowStyle} fixed>
      <View
        style={{
          width: `${headerCellWidth}%`,
          ...(useExternalBorders && borderedTableStyles.theader),
          ...(hasBottomBorder && { borderBottom: `1pt solid ${defaultTheme.colors.grey_1}` }),
        }}
      >
        <Text style={{ ...styles.tableCellStyle, ...styles.tableCellHeaderStyle }}>
          {headerName ? `${headerName}:` : ''}
        </Text>
      </View>

      <View
        style={{
          width: `${valueCellWidth}%`,
          ...(hasBottomBorder && { borderBottom: `1pt solid ${defaultTheme.colors.grey_1}` }),
        }}
      >
        <Text style={styles.tableCellStyle}>{value}</Text>
      </View>
    </View>
  );
};

export interface DataCell {
  fieldName?: PdfFieldName | string;
  fieldValue?: string | React.ReactElement;
}

const VerticalTable = ({
  data,
  useInternalBorders = true,
  useExternalBorders = false,
  headerCellWidth = 30,
  valueCellWidth = 70,
  style = {},
  wrap = false,
}: {
  data: DataCell[];
  useInternalBorders?: boolean;
  useExternalBorders?: boolean;
  headerCellWidth?: number;
  valueCellWidth?: number;
  style?: object;
  wrap?: boolean;
}) => {
  return (
    <View
      wrap={wrap}
      style={{
        ...commonStyles.text,
        ...styles.tableStyle,
        ...(useExternalBorders && borderedTableStyles.table),
        ...style,
      }}
    >
      {data.map((cell: DataCell, i: number) => {
        return (
          <TableRow
            key={`${cell.fieldName}-${i}`}
            headerName={cell.fieldName}
            value={cell.fieldValue}
            headerCellWidth={headerCellWidth}
            valueCellWidth={valueCellWidth}
            hasBottomBorder={useInternalBorders && i !== data.length - 1}
            useExternalBorders={useExternalBorders}
          />
        );
      })}
    </View>
  );
};

export default VerticalTable;
