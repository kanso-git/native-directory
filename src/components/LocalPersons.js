/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-fa-icons';
import { Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
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
    height: 35,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  touchable: {
    color: '#007aff',
  },
  touchableContainer: {
    marginBottom: 10,
  },
  addressStyle: {
    paddingLeft: 35,
  },
});

const {
  containerStyle,
  iconWrapper,
  iconStyle,
  textStyle,
  touchable,
  touchableContainer,
  addressStyle,
} = styles;

class LocalPersons extends Component {
  componentWillMount() {
    // const { occupents, targetLocal } = this.props.navigation.state.params;
    // this.props.loadOccupentsPerLocal(id);
  }

  renderOfficeAddress = location => (
    <TouchableOpacity
      style={[containerStyle]}
      onPress={() => Actions.push('mapPage', { buildingId: location.attributes.BAT_ID, localId: location.attributes.LOC_ID })}
    >
      <View style={[containerStyle]} >
        <View style={iconWrapper}>
          <Icon name="building" style={[iconStyle, touchable]} allowFontScaling />
        </View>
        <View style={[addressStyle, { paddingLeft: 5 }]}>
          <Text style={[touchable]}>{I18n.t('person.position.location.office')}: {location.attributes.LOC_TYPE_DESIGNATION} - {location.attributes.LOC_CODE} </Text>
          <Text style={[touchable]}>{I18n.t('person.position.location.floor')}: {location.attributes.ETG_DESIGNATION} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  renderBuildingAddress = building => (
    <TouchableOpacity
      onPress={() => Actions.push('mapPage', { buildingId: building.id })}
      style={[containerStyle, touchableContainer, { height: 80 }]}
    >
      <View style={{ height: 80 }} >
        <View style={iconWrapper}>
          <Icon name="map-marker" style={[iconStyle, touchable]} allowFontScaling />
        </View>
        <View style={[addressStyle, { paddingLeft: 25, marginTop: -15 }]}>
          { building.abreviation && <Text style={[touchable]}>{building.abreviation}</Text> }
          <Text style={[touchable, { height: 50 }]}>{`${building.adresseLigne1}
${building.npa} ${building.localite}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => Actions.push('memberDetails', { memberDetails: item })}>
      <CardSection style={[{ flexDirection: 'column', paddingLeft: 15 }]}>
        <Text style={{ fontSize: 18 }}>{item.prenom} { item.nom}</Text>
        <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>
          {item.index + 1}/{this.props.navigation.state.params.occupents.length}
        </Text>
      </CardSection>
    </TouchableOpacity>
  )

  render() {
    const { occupents, targetLocal, building } = this.props.navigation.state.params;
    const data = occupents.map((item, index) => ({ ...item, key: item.id, index }));

    return (
      <ScrollView>
        <Card>
          <CardSection style={{
            flexDirection: 'column',
                    height: 160,
            }}
          >
            { this.renderOfficeAddress(targetLocal) }
            { this.renderBuildingAddress(building) }
          </CardSection>

          <CardSection>
            <View style={[containerStyle, { height: 35 }]}>
              <Icon name="users" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
              <Text style={textStyle}>{I18n.t('local.occupants')} ({data.length})</Text>
            </View>
          </CardSection>
          <FlatList
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            data={data}
            renderItem={this.renderItem}
          />
        </Card>
      </ScrollView>
    );
  }
}

export default LocalPersons;
