/* eslint-disable react/prop-types */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
  },
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
  },
});

const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  const { headerTitle } = props;
  return (
    <View style={viewStyle}>
      <Text style={textStyle}> { headerTitle } </Text>
    </View>
  );
};


export default Header;
