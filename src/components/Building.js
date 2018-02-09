/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import Icon from 'react-native-fa-icons';
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { Card, CardSection, InputFlex } from './common';
import BuildingLocalItem from './BuildingLocalItem';


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
});
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
let memberListLen = 0;
const currentBuilding = {};
const {
  containerStyle,
  textStyle,
  textStyleElem,
  touchable,
  touchableContainer,
  addressStyle,
} = styles;


class Building extends Component {
   renderSummaryInfo = buildingObj => (
     <View style={[containerStyle]}>
       <Text style={[textStyleElem]}>Nombre d'étages : {buildingObj.floors.length} </Text>
     </View>
   );


   renderNameAddress = (abreviation, addressLines, localite, npa) => (
     <TouchableOpacity onPress={() => console.log(' show the map')}>
       <View style={[containerStyle, { height: 20 }]}>
         <Text style={[textStyle, touchable]}>{abreviation}</Text>
       </View>
       <View style={[containerStyle, { marginBottom: 5, height: 30 }, touchableContainer]}>
         <View style={addressStyle}>
           <Text style={[touchable]}>{`${addressLines}
${npa} ${localite}`}
           </Text>
         </View>
       </View>
     </TouchableOpacity>
   );

   onPressItem = (item) => {
     // Actions.replace('memberDetails', { memberDetails: item });
   };
   renderItem = ({ item }) => {
     console.log(item);
     return (
       <BuildingLocalItem
         item={item}
         image={item.attributes ?
          this.props.images[item.attributes.OBJECTID] : this.props.images[item.id]}
         building={this.currentBuilding}
         style={{ paddingLeft: 10 }}
         listLen={this.memberListLen}
         pressFn={this.onPressItem}
       />
     );
   };

   render() {
     this.currentBuilding = this.props.building;
     if (this.props.building.locals && this.props.building.locals.length > 0) {
       this.memberListLen = this.props.building.locals.length;
     }
     const {
       abreviation, adresseLigne1, localite, npa,
     } = this.props.building;
     return (
       <Card>
         <CardSection>
           <Image
             style={{ width: viewportWidth - 22, height: viewportHeight * 0.33 }}
             source={{ uri: this.props.building.image }}
           />
         </CardSection>
         <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
           { (adresseLigne1 && adresseLigne1.length > 0) &&
            this.renderNameAddress(abreviation, adresseLigne1, localite, npa)}
         </CardSection>
         { (this.props.building.locals && this.props.building.locals.length > 0) &&
         <FlatList
           data={this.props.building.locals}
           extraData={this.props.building.locals}
           renderItem={this.renderItem}
         />
        }

       </Card>
     );
   }
}

const mapStateToProps = state => (
  {
    images: state.bilune.images,
  }
);

export default connect(mapStateToProps)(Building);
