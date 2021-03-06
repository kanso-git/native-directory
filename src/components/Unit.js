/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-fa-icons';
import { Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
import { Card, CardSection, utile } from './common';
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
    paddingBottom: 10,
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
  <TouchableOpacity onPress={() => utile.email([email])}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{email} </Text>
    </View>
  </TouchableOpacity>
);
const renderPersonlUrl = (url) => {
  if (url) {
    return (
      <TouchableOpacity onPress={() => utile.web(url)}>
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
    onPress={() => utile.phonecall(phone.external, true)}
  >
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="phone" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{phone.external} </Text>
    </View>
  </TouchableOpacity>
);
const renderFax = fax => (
  <TouchableOpacity key={fax.external} onPress={() => utile.phonecall(fax.external, true)}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="fax" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{fax.external} </Text>
    </View>
  </TouchableOpacity>
);

const renderAddress = (building, addressLines) => (
  <TouchableOpacity onPress={() => Actions.push('mapPage', { buildingCode: building.code })}>
    <View style={[containerStyle, { marginBottom: 15, height: 45 }]}>
      <View style={iconWrapper}>
        <Icon name="map-marker" style={[iconStyle, touchable]} allowFontScaling />
      </View>
      <View style={addressStyle}>
        { addressLines.map(line => <Text style={[touchable]} key={line}> {line}</Text>)}
      </View>
    </View>
  </TouchableOpacity>
);

const onPressItem = (item) => {
  Actions.push('memberDetails', { memberDetails: item });
};
const renderItem = ({ item }) => (
  <SearchItem
    item={item}
    style={{ paddingLeft: 10 }}
    listLen={memberListLen}
    pressFn={onPressItem}
  />
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

  /*
    "addressLines": [
        "Rue Emile-Argand 11",
        "2000 Neuchâtel"
    ]
  */
  let building = null;
  if (addressLines && addressLines.length > 0) {
    building = props.buildings.find((b) => {
      const bAdresseLigne1 = b.adresseLigne1;
      const bAdresseLigne2 = `${b.npa} ${b.localite}`;
      if (bAdresseLigne1.toLowerCase() === addressLines[0].toLowerCase() &&
      bAdresseLigne2.toLowerCase() === addressLines[1].toLowerCase()) {
        return true;
      }
      return false;
    });
  }
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
        { (addressLines && addressLines.length > 0) && renderAddress(building, addressLines)}
      </CardSection>
      <CardSection>
        <View style={[containerStyle, { height: 35 }]}>
          <Icon name="users" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>{I18n.t('unit.members')} ({props.unitMembers.length})</Text>
        </View>
      </CardSection>
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        data={props.unitMembers}
        extraData={props.unitMembers}
        renderItem={renderItem}
      />
    </Card>
  );
};

export default Unit;
