/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux';
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
  iconWrapper: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressStyle: {
    paddingLeft: 20,
  },
});
const {
  containerStyle,
  iconWrapper,
  iconStyle,
  textStyle,
  textStyleElem,
  touchable,
  touchableContainer,
  addressStyle,
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
const renderEmail = email => (
  <TouchableOpacity onPress={() => Communications.email([email], null, null, 'My Subject', 'My body text')}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{email} </Text>
    </View>
  </TouchableOpacity>
);

const renderOfficeAddress = location => (
  <View style={[containerStyle, { marginBottom: 15 }]}>
    <View style={iconWrapper}>
      <Icon name="building" style={iconStyle} allowFontScaling />
    </View>
    <View style={addressStyle}>
      <Text>Bureau: {location.local.code} </Text>
      <Text>Étage: {location.floor.name} </Text>
    </View>
  </View>
);
const renderBuildingAddress = building => (
  <View style={[containerStyle, { marginBottom: 15, height: 45 }]}>
    <View style={iconWrapper}>
      <Icon name="map-marker" style={iconStyle} allowFontScaling />
    </View>
    <View style={addressStyle}>
      {building.name && <Text > {building.name}</Text>}
      { building.addressLines.map(line => <Text key={line}> {line}</Text>)}
    </View>
  </View>
);

const renderFunctions = props => props.person.positions.map(position => (

  <CardSection key={position.organizationalUnit.id} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
    {
      position.positionName && (
      <View style={[containerStyle, { marginBottom: 15 }]}>
        <Icon name="suitcase" style={iconStyle} allowFontScaling />
        <Text style={textStyleElem}>{position.positionName} </Text>
      </View>
    )
    }
    {
        position.organizationalUnit && (
        <TouchableOpacity onPress={() => Actions.replace('unitDetails', { unitDetails: position.organizationalUnit })}>
          <View style={[containerStyle, touchableContainer]}>
            <Icon name="sitemap" style={[iconStyle, touchable]} allowFontScaling />
            <Text style={[textStyleElem, touchable]}>{position.organizationalUnit.name} </Text>
          </View>
        </TouchableOpacity>
        )

    }

    {
        position.location && (
        renderOfficeAddress(position.location)
        )
    }
    {
      (position.location && position.location.building) && (
        renderBuildingAddress(position.location.building)
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
        { email && renderEmail(email)}
        { props.person.phones && renderPhones(props)}
        { url && renderPersonlUrl(url)}
      </CardSection>
      { props.person.positions && renderFunctions(props)}
    </Card>
  );
};

export default Person;
