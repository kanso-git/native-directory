/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-fa-icons';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { biluneActions } from './actions';
import { Card, CardSection, InputFlex } from './common';
import BuildingLocalItem from './BuildingLocalItem';
import BuildingSummary from './BuildingSummary';


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
    color: '#007aff',
  },
  touchableContainer: {
    marginBottom: 15,
  },
  addressStyle: {
    paddingLeft: 5,
    paddingBottom: 10,
  },
  flipCard: {
    flex: 1,
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: '#E5EFF5',
    position: 'absolute',
    top: 0,
  },
  flipText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  flipBtn: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 10,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
});
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const {
  textStyle,
  touchable,
  touchableContainer,
  addressStyle,
} = styles;


class Local extends Component {
  state={
    showDetails: true,
  }
  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  }

  onShowHideFloor = (floorId) => {
    this.props.showHideBuildingFloor(this.props.currentBuilding.id, parseInt(floorId, 10));
  }
  onPressItem = (item) => {
    this.props.setLocalId(item.attributes.LOC_ID, item.attributes.BAT_ID);
    Actions.push('localDetails');
  };
  onSearch = (value) => {
    this.props.searchInBuilding(this.props.currentBuilding.id, value);
  }
  flipCard = () => {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
      this.setState(() => ({ showDetails: true }));
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
      this.setState(() => ({ showDetails: false }));
    }
  }

   renderItem = ({ item }) => (
     <BuildingLocalItem
       item={item}
       visibleFloors={this.props.visibleFloors}
       image={item.attributes ?
          this.props.images[item.attributes.OBJECTID] : this.props.images[item.id]}
       building={this.props.currentBuilding}
       style={{ paddingLeft: 10 }}
       listLen={this.props.currentBuilding.locals.length}
       pressFn={this.onPressItem}
       showHideFloor={this.onShowHideFloor}
     />
   );

   render() {
     console.log('Building.js');
     const frontAnimatedStyle = {
       transform: [
         { rotateY: this.frontInterpolate },
       ],
     };
     const backAnimatedStyle = {
       transform: [
         { rotateY: this.backInterpolate },
       ],
     };

     const {
       abreviation, adresseLigne1, localite, npa,
     } = this.props.currentBuilding;
     return (
       <View>

         <View style={{ height: (viewportHeight * 0.33) + 60 }} >
           <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
             <Image
               style={{ width: viewportWidth, height: viewportHeight * 0.33, backgroundColor: '#034d7c' }}
               source={{ uri: this.props.currentBuilding.image }}
             />
           </Animated.View>

           <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
             <View style={{ width: viewportWidth }}>
               <BuildingSummary currentBuilding={this.props.currentBuilding} />
             </View>
           </Animated.View>
           {
            this.state.showDetails && (
              <TouchableOpacity
                style={{
                        width: viewportWidth,
                        position: 'absolute',
                        top: viewportHeight * 0.33,
                        paddingLeft: 5,
                        paddingTop: 10,
                        backgroundColor: '#DFDFDF',
                      }}
                onPress={() => {
                  Actions.push('mapPage');
                }}
              >
                <View style={[{ height: 20 }]}>
                  <Text style={[textStyle, touchable]}>{abreviation}</Text>
                </View>
                <View style={[{ marginBottom: 5, height: 30 }, touchableContainer]}>
                  <View style={addressStyle}>
                    <Text style={[touchable]}>{`${adresseLigne1}
${npa} ${localite}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
           <TouchableOpacity style={styles.flipBtn} onPress={() => this.flipCard()}>
             <Icon name="cog" style={{ fontSize: 20 }} allowFontScaling />
           </TouchableOpacity>

         </View>
         <Card>
           <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
             <InputFlex
               icon="&#x1F50E;"
               style={{
              height: 40, borderRadius: 5, borderWidth: 1, borderColor: '#dfdfdf',
            }}
               placeholder={I18n.t('search.placeholderBlding')}
               value={this.props.currentBuilding.query}
               onChangeText={this.onSearch}
             />
           </CardSection>

           { (this.props.currentBuilding.locals && this.props.currentBuilding.locals.length > 0) &&
           <FlatList
             data={this.props.currentBuilding.locals}
             extraData={this.props.currentBuilding.floors}
             renderItem={this.renderItem}
           />
        }

         </Card>
       </View>
     );
   }
}

const mapStateToProps = state => (
  {
    images: state.bilune.images,
    currentBuilding: state.bilune.buildings.find(b => b.id === state.bilune.id),
    visibleFloors: state.bilune.buildings
      .find(b => b.id === state.bilune.id)
      .floors.filter(f => !f.collapsed),
  }
);

export default connect(mapStateToProps, { ...biluneActions })(Local);
