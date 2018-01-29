/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  chromatic: {
    height: 5,
    marginLeft: 0,
    marginRight: 0,
  },
});

const Chromatic = ({ height }) => (
  <LinearGradient
    style={[styles.chromatic, { height: height || 5 }]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.25, 0.5, 0.75, 1]}
    colors={['#0083b0', '#056734', '#b70f1d', '#eb9800', '#904c88']}
  />
);

export default Chromatic;
