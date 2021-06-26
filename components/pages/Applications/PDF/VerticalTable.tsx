import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

const styles = StyleSheet.create({
  tableStyle: {
    display: 'flex',
    width: 'auto',
    fontFamily: 'WorkSans',
    fontSize: '11px',
  },
  tableRowStyle: {
    flexDirection: 'row',
  },
  tableCellHeaderStyle: {
    fontWeight: 'semibold',
  },
  tableCellStyle: {
    padding: '6px 0',
  },
});

const TableRow = ({
  headerName = '',
  value = '',
  headerCellWidth,
  valueCellWidth,
  hasBottomBorder,
}: {
  headerName?: string;
  value?: string;
  headerCellWidth: number;
  valueCellWidth: number;
  hasBottomBorder: boolean;
}): ReactElement => {
  return (
    <View style={styles.tableRowStyle} fixed>
      <View
        style={{
          width: `${headerCellWidth}%`,
          ...(hasBottomBorder && { borderBottom: `1px solid ${defaultTheme.colors.grey_2}` }),
        }}
      >
        <Text style={{ ...styles.tableCellStyle, ...styles.tableCellHeaderStyle }}>
          {headerName}
        </Text>
      </View>

      <View
        style={{
          width: `${valueCellWidth}%`,
          ...(hasBottomBorder && { borderBottom: `1px solid ${defaultTheme.colors.grey_2}` }),
        }}
      >
        <Text style={styles.tableCellStyle}>{value}</Text>
      </View>
    </View>
  );
};

interface DataCell {
  fieldName?: string;
  fieldValue?: string;
}

const VerticalTable = ({
  data,
  useBorderStyle = true,
}: {
  data: DataCell[];
  useBorderStyle?: boolean;
}) => {
  return (
    <View style={styles.tableStyle}>
      {data.map((cell: DataCell, i: number) => {
        return (
          <TableRow
            key={`${cell.fieldName}-${i}`}
            headerName={cell.fieldName}
            value={cell.fieldValue}
            headerCellWidth={30}
            valueCellWidth={70}
            hasBottomBorder={useBorderStyle && i !== data.length - 1}
          />
        );
      })}
    </View>
  );
};

export default VerticalTable;
