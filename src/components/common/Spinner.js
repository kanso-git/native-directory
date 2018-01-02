import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Spinner = ({ size }) => (
  <View style={styles.spinnerContainer} >
    <ActivityIndicator size={size || 'large'} />
  </View>
);

export default Spinner;
