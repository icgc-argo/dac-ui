import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

const styles = StyleSheet.create({
  tableStyle: {
    display: 'flex',
    width: 'auto',
    fontFamily: 'WorkSans',
    fontSize: 11,
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

interface DataCell {
  fieldName?: string;
  fieldValue?: string | React.ReactElement;
}

const VerticalTable = ({
  data,
  useInternalBorders = true,
  useExternalBorders = false,
  headerCellWidth = 30,
  valueCellWidth = 70,
  style = {},
}: {
  data: DataCell[];
  useInternalBorders?: boolean;
  useExternalBorders?: boolean;
  headerCellWidth?: number;
  valueCellWidth?: number;
  style?: object;
}) => {
  return (
    <View
      style={{
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
