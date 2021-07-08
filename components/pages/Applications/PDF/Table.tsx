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
                borderBottom: 0,
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
