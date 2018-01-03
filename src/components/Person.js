/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-fa-icons';
import { Card, CardSection } from './common';

const styles = StyleSheet.create({
  textStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    flex: 11,
    height: 20,
    width: 100,
  },
  textStyleElem: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    flex: 11,
    height: 20,
    width: 100,
  },
  iconStyle: {
    fontSize: 18,
    paddingLeft: 5,
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
const {
  containerStyle,
  iconStyle,
  textStyle,
  textStyleElem,
} = styles;

const renderPersonlUrl = (url) => {
  if (url) {
    return (
      <View style={[containerStyle, { marginBottom: 15 }]}>
        <Icon name="external-link" style={iconStyle} allowFontScaling />
        <Text style={textStyleElem}>{url} </Text>
      </View>
    );
  }
  return null;
};
const renderPhones = props => props.person.phones.map(phone => (
  <View key={phone.external} style={[containerStyle, { marginBottom: 15 }]}>
    <Icon name="phone" style={iconStyle} allowFontScaling />
    <Text style={textStyleElem}>{phone.external} </Text>
  </View>
));

const renderFunctions = props => props.person.positions.map(position => (
  <CardSection key={position.organizationalUnit.id} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
    <View style={[containerStyle, { marginBottom: 15 }]}>
      <Icon name="suitcase" style={iconStyle} allowFontScaling />
      <Text style={textStyleElem}>{position.positionName} </Text>
    </View>
    <View style={[containerStyle, { marginBottom: 15 }]}>
      <Icon name="sitemap" style={iconStyle} allowFontScaling />
      <Text style={textStyleElem}>{position.organizationalUnit.name} </Text>
    </View>
    <View style={[containerStyle, { marginBottom: 15 }]}>
      <Icon name="building" style={iconStyle} allowFontScaling />
      <Text style={textStyleElem}>{position.location.local.code} </Text>
    </View>
  </CardSection>
));
const Person = (props) => {
  const {
    lastName,
    firstName,
    status,
    email,
    url,
  } = props.person;
  return (
    <Card>
      <CardSection>
        <View style={containerStyle}>
          <Icon name="user-circle-o" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>{firstName} {lastName}</Text>
        </View>
      </CardSection>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="info-circle" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{status}</Text>
        </View>
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="envelope" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{email} </Text>
        </View>
        { renderPhones(props)}
        { renderPersonlUrl(url)}
      </CardSection>
      { renderFunctions(props)}
    </Card>
  );
};

export default Person;
