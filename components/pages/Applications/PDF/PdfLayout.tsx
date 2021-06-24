import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px 10px',
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
    fontSize: '48px',
    fontWeight: 900,
    top: '47%', // better way to align this?
    left: '37%', // better way to align this?
    color: defaultTheme.colors.accent2,
    opacity: 0.2,
    textTransform: 'uppercase',
  },
  footer: {
    height: '20px',
    alignItems: 'center',
    fontFamily: 'WorkSans',
    fontSize: '14px',
  },
  header: {
    height: '20px',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: '14px',
    fontFamily: 'WorkSans',
  },
});

const Watermark = () => <Text style={styles.watermark}>draft</Text>;

const PDFLayout = ({
  userName, // need to get this from the application data, not the logged in user!
  appId = '',
  status = 'draft',
  children,
}: {
  userName?: string;
  appId?: string;
  status?: string;
  children: any;
}) => {
  const statusInDraft = status === 'draft';
  return (
    //   do i need wrap=false ?
    <Page style={styles.page} wrap={false}>
      <View style={styles.header} fixed>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} fixed />
      </View>
      <View style={styles.section}>{children}</View>
      <View style={styles.footer} fixed>
        <Text>
          {appId} created by {userName} using ICGC-DACO (https://www.daco.icgc.org)
        </Text>
      </View>
      {statusInDraft && <Watermark />}
    </Page>
  );
};

export default PDFLayout;
