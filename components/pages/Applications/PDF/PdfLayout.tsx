import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';

import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { ReactNode } from 'react';
import { PDFLink } from './common';
import { getConfig } from 'global/config';
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
  watermark: {
    position: 'absolute',
    transform: 'rotate(-45deg)',
    fontFamily: 'WorkSans',
    fontSize: 48,
    fontWeight: 900,
    top: '47%',
    left: '37%',
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
    fontFamily: 'WorkSans',
    fontSize: 8,
  },
  header: {
    height: '30pt',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 8,
    fontFamily: 'WorkSans',
  },
});

const Watermark = () => <Text style={styles.watermark}>draft</Text>;

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
  const isDraftState = state === ApplicationState.DRAFT;
  const displayName = `${applicant?.title ? `${applicant.title} ` : ''}${applicant?.displayName}`;
  return (
    <Page style={styles.page} wrap={false}>
      <View style={styles.header} fixed>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />
      </View>
      <View style={styles.section}>{children}</View>
      <View style={styles.footer} fixed>
        <Text>
          {appId} created for {displayName} by <PDFLink href={DACO_ROOT}>ICGC-DACO</PDFLink>
        </Text>
      </View>
      {isDraftState && <Watermark />}
    </Page>
  );
};

export default PDFLayout;
