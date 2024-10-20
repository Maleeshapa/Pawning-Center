import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

function Pdf() {
  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Maleesha </Text>
      </View>
      <View style={styles.section}>
        <Text>Pa</Text>
      </View>
    </Page>
  </Document>
  )
}

export default Pdf