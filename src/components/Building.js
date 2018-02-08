/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import Icon from 'react-native-fa-icons';
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
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
    paddingLeft: 5,
    paddingBottom: 10,
  },
});
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const memberListLen = 0;
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
  <TouchableOpacity onPress={() => Communications.email([email], null, null, ' ', ' ')}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{email} </Text>
    </View>
  </TouchableOpacity>
);
const renderSummaryInfo = buildingObj => (
  <View style={[containerStyle]}>
    <Text style={[textStyleElem]}>Nombre d'étages : {buildingObj.floors.length} </Text>
  </View>
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
const renderNameAddress = (abreviation, addressLines, localite, npa) => (
  <TouchableOpacity onPress={() => console.log(' show the map')}>
    <View style={[containerStyle, { height: 25 }]}>
      <Text style={[textStyle, touchable]}>{abreviation}</Text>
    </View>
    <View style={[containerStyle, { marginBottom: 5, height: 45 }, touchableContainer]}>
      <View style={addressStyle}>
        <Text style={[touchable]}>{`${addressLines}
${npa} ${localite}`}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const onPressItem = (item) => {
  // Actions.replace('memberDetails', { memberDetails: item });
};
const renderItem = ({ item }) => {
  console.log(item);
  return (
    <SearchItem
      item={item}
      style={{ paddingLeft: 10 }}
      listLen={memberListLen}
      pressFn={onPressItem}
    />
  );
};
const Building = (props) => {
  const {
    abreviation,
    adresseLigne1,
    localite,
    npa,
  } = props.building;

  return (
    <Card>
      <CardSection>
        <Image
          style={{ width: viewportWidth - 22, height: viewportHeight * 0.33 }}
          source={{ uri: props.building.image }}
        />
      </CardSection>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        { (adresseLigne1 && adresseLigne1.length > 0) &&
          renderNameAddress(abreviation, adresseLigne1, localite, npa)}
        { (props.building.floors && props.building.floors.length > 0) &&
          renderSummaryInfo(props.building)}
      </CardSection>
      { (props.building.locals && props.building.locals.length > 0) &&
        <FlatList
          data={props.building.locals}
          extraData={props.building.locals}
          renderItem={renderItem}
        />
      }

    </Card>
  );
};

export default Building;
