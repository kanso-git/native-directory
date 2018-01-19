import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-fa-icons';
import { Card, CardSection, Chromatic } from './common';

const styles = StyleSheet.create({
  textStyleElem: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    flex: 11,
    width: 100,
    height: 50,
  },
  titleStyleElem: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    flex: 1,
    height: 150,
    width: 100,
  },
  iconStyle: {
    color: 'red',
    fontSize: 25,
    paddingLeft: 5,
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

const {
  containerStyle,
  iconStyle,
  textStyleElem,
  titleStyleElem,
} = styles;

const renderNetworkError = () => (
  <View >
    <View style={[containerStyle, { marginBottom: 35 }]}>
      <Icon name="exclamation-triangle" style={iconStyle} allowFontScaling />
      <Text style={textStyleElem}>{I18n.t('offline.header')}</Text>
    </View>
    <View style={[containerStyle, { marginBottom: 25 }]}>
      <Text style={titleStyleElem}>{I18n.t('offline.p1')} </Text>
    </View>
  </View>
);

const NetworkError = () => (
  <View>
    <Chromatic />
    <Card >
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between', height: 300 }}>{renderNetworkError()}</CardSection>
    </Card>
  </View>
);
export default NetworkError;
