/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { PERSON, UNIT, LOCAL, BUILDING } from 'react-native-dotenv';

import I18n from 'react-native-i18n';

import { CardSection, Chromatic } from './common';

class SearchItem extends Component {
   switchOnType = (item, pressFn, listLen, style) => {
     switch (item.type) {
       case PERSON:
         return this.renderPersonItem(item, listLen, style);
       case UNIT:
         return this.renderUnitItem(item, listLen);
       case LOCAL:
         return this.renderLocalWithImageItem(item, listLen);
       case BUILDING:
         return this.renderBuildingItem(item, listLen);
       default:
         break;
     }
   };


   renderLocalWithImageItem = (item, listLen) => (
     <CardSection >
       <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row' }}>
           <Image
             style={{ width: 60, height: 60 }}
             source={{ uri: item.base64Image }}
           />
           <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
             <Text style={{ fontSize: 18 }}>{`${item.attributes.LOC_CODE}, (${item.attributes.LOC_TYPE_DESIGNATION})`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>{`${item.attributes.ETG_DESIGNATION}, ${item.building.abreviation}, ${item.building.adresseLigne1}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>{`${item.building.localite}, ${item.building.npa}`} </Text>
           </View>
         </View>
         <View style={{
           alignItems: 'flex-end',
           justifyContent: 'flex-end',

        }}
         >
           <Text style={{ fontSize: 10, paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
         </View>
       </View>
     </CardSection>
   );

   renderBuildingItem = (item, listLen) => (
     <CardSection>
       <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row' }}>
           <Image
             style={{ width: 60, height: 60 }}
             source={{ uri: item.base64Image }}
           />
           <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
             <Text style={{ fontSize: 18 }}>{item.abreviation} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>{`${item.adresseLigne1}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>{`${item.localite}, ${item.npa}`} </Text>
           </View>
         </View>
         <View style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',

         }}
         >
           <Text style={{ fontSize: 10, paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
         </View>
       </View>
     </CardSection>
   );

   renderPersonItem = (item, listLen, style = {}) => (
     <CardSection style={[{ flexDirection: 'column' }, style]}>
       <Text style={{ fontSize: 18 }}>{item.firstName} { item.lastName}</Text>
       <Text>
         {item.positions && item.positions[0].positionName ? `${item.positions[0].positionName}, ` : ''}
         {item.positions && item.positions[0].organizationalUnit ? item.positions[0].organizationalUnit.name : '' }
       </Text>
       <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
     </CardSection>
   );

   renderUnitItem = (item, listLen) => (
     <CardSection style={{ flexDirection: 'column' }}>
       <Text style={{ fontSize: 18 }}>{item.name} </Text>
       <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
     </CardSection>
   );
   renderSectionJsx = text => (
     <View>
       <Text style={{
          fontSize: 18,
          padding: 5,
          backgroundColor: '#E5EFF5',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          elevation: 2,
        }}
       >
         {text}
       </Text>
       <Chromatic height={2} />
     </View>
   )
   renderSection = (item) => {
     if (item.index === 0 || item.subIndex === 0) {
       switch (item.type) {
         case PERSON:
         case UNIT:
           return this.renderSectionJsx(I18n.t('section.personUnit'));
         case LOCAL:
           return this.renderSectionJsx(I18n.t('section.local'));
         case BUILDING:
           return this.renderSectionJsx(I18n.t('section.building'));
         default:
           break;
       }
     }
   }

   render() {
     const {
       item, pressFn, listLen, style,
     } = this.props;
     console.log(item.base64Image);
     return (
       <View>
         { this.renderSection(item) }
         <TouchableOpacity onPress={() => pressFn(item)}>
           { this.switchOnType(item, pressFn, listLen, style) }
         </TouchableOpacity>
       </View>
     );
   }
}

export default SearchItem;
