/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-fa-icons';
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux';

import { Card, CardSection } from './common';
import SearchItem from './SearchItem';


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
  iconWrapper: {
    height: 20,
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
  addressStyle: {
    paddingLeft: 20,
  },
});
let memberListLen = 0;
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
const renderEmail = email => (
  <TouchableOpacity onPress={() => Communications.email([email], null, null, 'My Subject', 'My body text')}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{email} </Text>
    </View>
  </TouchableOpacity>
);
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
const renderPhone = phone => (
  <TouchableOpacity
    key={phone.external}
    onPress={() => Communications.phonecall(phone.external, true)}
  >
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="phone" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{phone.external} </Text>
    </View>
  </TouchableOpacity>
);
const renderFax = fax => (
  <TouchableOpacity key={fax.external} onPress={() => Communications.phonecall(fax.external, true)}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="fax" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{fax.external} </Text>
    </View>
  </TouchableOpacity>
);
const renderAddress = addressLines => (
  <View style={[containerStyle, { marginBottom: 15 }]}>
    <View style={iconWrapper}>
      <Icon name="map-marker" style={iconStyle} allowFontScaling />
    </View>
    <View style={addressStyle}>
      { addressLines.map(line => <Text key={line}>{line}</Text>)}
    </View>
  </View>
);

const onPressItem = (item) => {
  console.log('clicked item -------');
  Actions.replace('memberDetails', { memberDetails: item });
};
const renderItem = ({ item }) => (
  <SearchItem item={item} listLen={memberListLen} pressFn={onPressItem} />
);
const Unit = (props) => {
  memberListLen = props.unitMembers.length;
  const {
    name,
    email,
    phone,
    fax,
    url,
    addressLines,
  } = props.unit.unit;

  return (
    <Card>
      <CardSection>
        <View style={[containerStyle, { height: 35 }]}>
          <Icon name="sitemap" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>{name}</Text>
        </View>
      </CardSection>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

        { email && renderEmail(email)}
        { url && renderPersonlUrl(url)}
        { phone && renderPhone(phone)}
        { fax && renderFax(fax)}
        { (addressLines && addressLines.length > 0) && renderAddress(addressLines)}
      </CardSection>
      <CardSection>
        <View style={[containerStyle, { height: 35 }]}>
          <Icon name="users" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>Membres de l'unité ({props.unitMembers.length})</Text>
        </View>
      </CardSection>
      <FlatList
        data={props.unitMembers}
        extraData={props.unitMembers}
        renderItem={renderItem}
      />
    </Card>
  );
};

export default Unit;
