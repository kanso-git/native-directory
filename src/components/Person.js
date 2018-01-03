/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-fa-icons';
import { Card, CardSection } from './common';
import Communications from 'react-native-communications';

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
    height: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  touchable: {
    color: '#007aff',
  },
  touchableContainer: {
    marginBottom: 15,
  },
});
const {
  containerStyle,
  iconStyle,
  textStyle,
  textStyleElem,
  touchable,
  touchableContainer,
} = styles;

const renderPersonlUrl = (url) => {
  if (url) {
    return (
      <TouchableOpacity onPress={() => Communications.web(url)}>
        <View style={[containerStyle, touchableContainer]}>
          <Icon name="external-link" style={[iconStyle, touchable]} allowFontScaling />
          <Text style={[textStyleElem, touchable]}>{url} </Text>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};
const renderPhones = props => props.person.phones.map(phone => (
  <TouchableOpacity key={phone.external} onPress={() => Communications.phonecall(phone.external, true)}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="phone" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{phone.external} </Text>
    </View>
  </TouchableOpacity>
));

const renderFunctions = props => props.person.positions.map(position => (
  <CardSection key={position.organizationalUnit.id} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
    <View style={[containerStyle, { marginBottom: 15 }]}>
      <Icon name="suitcase" style={iconStyle} allowFontScaling />
      <Text style={textStyleElem}>{position.positionName} </Text>
    </View>
    {
        position.organizationalUnit && (
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="sitemap" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{position.organizationalUnit.name} </Text>
        </View>
        )

    }

    {
        position.location && (
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="building" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{position.location.local.code} </Text>
        </View>
        )
    }

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
        <View style={[containerStyle, { height: 35 }]}>
          <Icon name="user-circle-o" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>{firstName} {lastName}</Text>
        </View>
      </CardSection>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="info-circle" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{status}</Text>
        </View>
        <TouchableOpacity onPress={() => Communications.email([email], null, null, 'My Subject', 'My body text')}>
          <View style={[containerStyle, touchableContainer]}>
            <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
            <Text style={[textStyleElem, touchable]}>{email} </Text>
          </View>
        </TouchableOpacity>
        { props.person.phones && renderPhones(props)}
        { url && renderPersonlUrl(url)}
      </CardSection>
      { props.person.positions && renderFunctions(props)}
    </Card>
  );
};

export default Person;
