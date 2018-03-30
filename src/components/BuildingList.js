/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { FlatList, Dimensions, Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { biluneActions } from './actions';
import { Chromatic } from './common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


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
    paddingTop: 2,
    paddingBottom: 2,
  },
  touchable: {
    color: 'white',
  },
  touchableContainer: {
    marginBottom: 15,
  },
  addressStyle: {
    paddingLeft: 5,
    paddingBottom: 10,
  },
  stickySection: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 18,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
  },
});
const {
  textStyle,
  touchable,
  touchableContainer,
  addressStyle,
} = styles;

class BuildingList extends Component {
  onPressItem = (item) => {
    this.props.setBuildingId(item);
    Actions.push('buildingDetails');
  };

  renderHeader = (currentBuilding) => {
    const {
      abreviation, adresseLigne1, localite, npa,
    } = currentBuilding;
    const infoBuilding = '';
    return (
      <TouchableOpacity
        style={{
       width: viewportWidth,
       paddingLeft: 5,
       paddingRight: 5,
       paddingTop: 10,
       backgroundColor: 'rgba(52, 52, 52, 0.5)',
       justifyContent: 'flex-end',
       alignItems: 'flex-start',
       }}
        onPress={() => {
                 Actions.push('mapPage', { buildingId: currentBuilding.id, localId: null });
               }}
      >

        <View style={[{ height: 24, flexDirection: 'row' }]}>
          <Text style={[textStyle, touchable]}>{abreviation}</Text>
          <Text style={[touchable, { paddingRight: 10, paddingTop: 4, textAlignVertical: 'bottom' }]}>{infoBuilding}</Text>
        </View>

        <View style={[{ marginBottom: 5, height: 40 }, touchableContainer]}>
          <View style={addressStyle}>
            <Text style={[touchable]}>{`${adresseLigne1}
${npa} ${localite}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  renderItem = ({ item }) => (
    <View>
      <Chromatic />
      <Image
        style={{ width: viewportWidth, height: (viewportHeight * 0.25) + 80, backgroundColor: '#034d7c' }}
        source={{ uri: this.props.images[item.id] }}
      />
      <View style={[styles.parallaxHeader,
        { paddingTop: (viewportHeight * 0.25), width: viewportWidth }]}
      >
        {this.renderHeader(item)}
      </View>
    </View>
  );
  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        data={this.props.buildings.map((r, index) => ({ ...r, key: r.id, index }))}
        extraData={this.props.images}
        renderItem={this.renderItem}
      />
    );
  }
}


const mapStateToProps = state => (
  {
    images: state.bilune.images,
    buildings: state.bilune.buildings,
    locals: state.bilune.locals,
  }
);

export default connect(mapStateToProps, { ...biluneActions })(BuildingList);
