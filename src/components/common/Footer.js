/* eslint-disable react/prop-types */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
  },
  viewStyle: {
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...ifIphoneX({
      paddingBottom: 20,
      height: 60,
    }),
  },
});

const Footer = (props) => {
  const { textStyle, viewStyle } = styles;
  const { footerTitle1, footerTitle2 } = props;
  return (
    <View style={viewStyle}>
      <Text style={textStyle}> { footerTitle1 } </Text>
      <Text style={textStyle}> { footerTitle2 } </Text>
    </View>
  );
};


export default Footer;
