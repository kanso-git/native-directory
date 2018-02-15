/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-fa-icons';
import { LOCAL } from 'react-native-dotenv';

import I18n from 'react-native-i18n';

import { CardSection, Chromatic, statics } from './common';

class BuildingLocalItem extends Component {
 
   checkIfFloorIsVisible = (floors, floorId) => {
     const id = parseInt(floorId, 10);
     const currentFloor = floors.filter(f => f.id === id);
     return !!currentFloor.length;
   }
   switchOnType = (item, building, visibleFloors, pressFn, listLen, style, image) => {
     switch (item.type) {
       case LOCAL:
         return this.checkIfFloorIsVisible(visibleFloors, item.attributes.ETG_ID) && this.renderLocalWithImageItem(item, building, listLen, image);
       default:
         break;
     }
   };
   renderLocalWithImageItem = (item, building, listLen, image) => (
     <CardSection >
       <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row' }}>
           <Image
             style={{ width: 60, height: 60, backgroundColor: '#034d7c' }}
             source={{ uri: image || statics.noImageIcon }}
           />
           <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
             <Text style={{ fontSize: 16 }}>Local code: {`${item.attributes.LOC_CODE}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>Type: {`${item.attributes.LOC_TYPE_DESIGNATION}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>Étage: {`${item.attributes.ETG_DESIGNATION}`} </Text>
           </View>
         </View>
         <View style={{
           alignItems: 'flex-end',
           justifyContent: 'flex-end',
          }}
         >
           <Text style={{ fontSize: 10, paddingTop: -5, paddingRight: 2 }}>
             { item.index + 1 }/{listLen}
           </Text>
         </View>
       </View>
     </CardSection>
   );

   renderSectionJsx = (text, floorId, visibleFloors) => (
     <TouchableOpacity onPress={() => this.props.showHideFloor(floorId)}>
       <CardSection style={{
        flexDirection: 'row',
        backgroundColor: '#E5EFF5',
        marginTop: 0,
        marginBottom: -5,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        elevation: 2,
         shadowOffset: { width: 0, height: 2 },
      }}
       >
         <Icon
           name={this.checkIfFloorIsVisible(visibleFloors, floorId) ? 'minus-square-o' : 'plus-square-o'}
           style={{
            fontSize: 25,
            padding: 0,
            paddingLeft: 2,
            paddingRight: 5,

      }}
         />
         <Text style={{
          fontSize: 18,
          padding: 0,

        }}
         >
           {text}
         </Text>
         <Chromatic height={2} />
       </CardSection>
     </TouchableOpacity>
   )
   renderSection = (item, visibleFloors) => {
     if (item.attributes.section) {
       return this.renderSectionJsx(item.attributes.section, item.attributes.ETG_ID, visibleFloors);
     }
   }

   render() {
     const {
       item, pressFn, listLen, style, image, building, visibleFloors,
     } = this.props;
     return (
       <View>
         { this.renderSection(item, visibleFloors) }
         <TouchableOpacity onPress={() => pressFn(item)}>
           { this.switchOnType(item, building, visibleFloors, pressFn, listLen, style, image) }
         </TouchableOpacity>
       </View>
     );
   }
}

export default BuildingLocalItem;
