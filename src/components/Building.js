/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { biluneActions } from './actions';
import { Card, CardSection, InputFlex, Chromatic } from './common';
import BuildingLocalItem from './BuildingLocalItem';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
  infoBuildingStyle: {
    paddingRight: 5,
    height: 10,
    alignItems: 'flex-end',
    width: viewportWidth,
    paddingBottom: 5,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
  },
  textStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
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
    paddingBottom: 5,
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
  },
});

const {
  textStyle,
  touchable,
  touchableContainer,
  addressStyle,
  infoBuildingStyle,
  textShadow,
} = styles;


class Local extends Component {
  componentWillMount() {
  }

  onShowHideFloor = (floorId) => {
    const sQuery = this.props.currentBuilding.query;
    this.props.expandCollapseBuildingFloor(parseInt(floorId, 10), sQuery);
  }
  onPressItem = (item) => {
    this.props.setLocalId(item.attributes.LOC_ID, item.attributes.BAT_ID);
    const typeCode = item.attributes.LOC_TYPE_ID;
    if (typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3) {
      Actions.push('localDetails');
    } else {
      Actions.push('mapPage', { buildingId: item.attributes.BAT_ID, localId: item.attributes.LOC_ID });
    }
  };
  onSearch = (value) => {
    this.props.searchInBuilding(this.props.currentBuilding.id, value);
  }


   renderItem = ({ item }) => (
     <BuildingLocalItem
       item={item}
       visibleFloors={this.props.visibleFloors}
       building={this.props.currentBuilding}
       style={{ paddingLeft: 10 }}
       listLen={this.props.currentBuilding.totalLocalsLen}
       pressFn={this.onPressItem}
       showHideFloor={this.onShowHideFloor}
     />
   );
   renderHeader = () => {
     const {
       abreviation, adresseLigne1, localite, npa,
     } = this.props.currentBuilding;

     let infoBuilding = '';
     if (this.props.currentBuilding.floors) {
       infoBuilding = `${this.props.currentBuilding.floors.length} ${I18n.t('building.floors')},  ${this.props.buildingLocalsNbr} ${I18n.t('building.locals')} `;
     }

     return (
       <TouchableOpacity
         style={{
        width: viewportWidth,
        paddingLeft: 5,
        paddingTop: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        }}
         onPress={() => {
                  Actions.push('mapPage', { buildingId: this.props.currentBuilding.id, localId: null });
                }}
       >

         <View style={[{ height: 25, flexDirection: 'row' }]}>
           <Text style={[textStyle, touchable, textShadow]}>{abreviation}</Text>
         </View>

         <View style={[{ marginBottom: 5, height: 45 }, touchableContainer]}>
           <View style={addressStyle}>
             <Text style={[touchable, textShadow]}>{`${adresseLigne1}
${npa} ${localite}`}
             </Text>
           </View>
           <View style={infoBuildingStyle}>
             <Text style={[touchable, textShadow]}>{infoBuilding}</Text>
           </View>
         </View>
       </TouchableOpacity>
     );
   }
   render() {
     const { onScroll = () => {} } = this.props;

     return (
       <ParallaxScrollView
         onScroll={onScroll}
         headerBackgroundColor="transparent"
         stickyHeaderHeight={90}
         parallaxHeaderHeight={(viewportHeight * 0.25) + 90}
         backgroundSpeed={10}
         keyboardShouldPersistTaps="always"
         keyboardDismissMode="on-drag"
         renderBackground={() => (
           <View key="background">
             <Chromatic />
             <Image
               style={{ width: viewportWidth, height: (viewportHeight * 0.25) + 90, backgroundColor: '#034d7c' }}
               source={{ uri: this.props.currentBuilding.image }}
             />
             <View style={{
           position: 'absolute',
                                        top: 0,
                                        width: window.width,
                                        backgroundColor: 'rgba(52, 52, 52, 0.5)',
                                        height: (viewportHeight * 0.25),
          }}
             />

           </View>
       )}

         renderForeground={() => (
           <View key="parallax-header" style={[styles.parallaxHeader, { paddingTop: (viewportHeight * 0.25), width: viewportWidth }]}>
             {this.renderHeader()}
           </View>
     )}
         renderStickyHeader={() => (
           <View key="sticky-header" style={styles.stickySection}>
             {this.renderHeader()}
           </View>
       )}

         renderFixedHeader={() => (
           <View key="fixed-header" style={styles.fixedSection} />
       )}
       >
         <View>
           <Card>
             <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
               <InputFlex
                 icon="&#x1F50E;"
                 style={{
                    height: Platform.OS === 'android' ? 50 : 40,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#dfdfdf',
                 }}
                 placeholder={I18n.t('search.placeholderBlding')}
                 value={this.props.currentBuilding.query}
                 onChangeText={this.onSearch}
               />
             </CardSection>

             { (this.props.currentBuilding.locals && this.props.currentBuilding.locals.length > 0) &&
             <FlatList
               keyboardShouldPersistTaps="always"
               keyboardDismissMode="on-drag"
               data={this.props.currentBuilding.locals}
               extraData={this.props.currentBuilding.floors}
               renderItem={this.renderItem}
             />
        }
           </Card>
         </View>
       </ParallaxScrollView>
     );
   }
}
const setImagesForLocals = (buildings, currentBuildingId, images) => {
  const currentBuilding = buildings.find(b => b.id === currentBuildingId);
  const localsWithImage = currentBuilding.locals.map((l) => {
    const image = images[l.attributes.OBJECTID];
    return { ...l, image };
  });
  return { ...currentBuilding, locals: localsWithImage };
};
const mapStateToProps = state => (
  {
    images: state.bilune.images,
    buildingLocalsNbr: state.bilune.locals
      .filter(l => l.attributes.BAT_ID === state.bilune.id).length,
    currentBuilding: setImagesForLocals(state.bilune.buildings, state.bilune.id, state.bilune.images),
    visibleFloors: state.bilune.buildings
      .find(b => b.id === state.bilune.id)
      .floors.filter(f => !f.collapsed),
  }
);

export default connect(mapStateToProps, { ...biluneActions })(Local);
