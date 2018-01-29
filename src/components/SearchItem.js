/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import axios from 'axios';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { PERSON, UNIT, LOCAL, BUILDING, BDL_SECURITY_TOKEN, BDL_SECURITY_TOKEN_VAL, API_BDL } from 'react-native-dotenv';
import I18n from 'react-native-i18n';
import { CardSection, Chromatic } from './common';

const headers = {};
headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;

const base64Image0 = 'data:image/png;base64,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';
class SearchItem extends Component {
   state={
     base64Image: base64Image0,
   }
   componentDidMount() {
     const { item } = this.props;
     if (item.type === BUILDING) {
       this.getBase64Image(`${API_BDL}/batiments/${item.id}/photo/mini.jpg`);
     }
     if (item.type === LOCAL) {
       this.getBase64Image(`${API_BDL}/locaux/${item.attributes.LOC_ID}/photo/mini.jpg`);
     }
   }

   getBase64Image = async (url) => {
     try {
       console.log(url);
       const res = await axios.get(url, { responseType: 'arraybuffer', headers });
       if (res.data) {
         const u8 = new Uint8Array(res.data);
         const b64encoded = btoa([].reduce.call(u8, (p, c) => p + String.fromCharCode(c), ''));
         const mimetype = 'image/jpg';
         this.setState(() => ({
           base64Image: `data:${mimetype};base64,${b64encoded}`,
         }));
       }
     } catch (e) {
       this.setState(() => ({
         base64Image: base64Image0,
       }));
     }
   };

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


   renderLocalItem2 = (item, listLen) => (
     <CardSection style={{ flexDirection: 'column' }}>
       <Text style={{ fontSize: 18 }}>{I18n.t('local.title')}: {`${item.attributes.LOC_CODE}`} </Text>
       <Text style={{ fontSize: 13, paddingTop: 5 }}>{I18n.t('local.floor')}: {`${item.attributes.ETG_DESIGNATION}`} </Text>
       <Text style={{ fontSize: 13, paddingTop: 2 }}>{`${item.building.abreviation}, ${item.building.adresseLigne1}`} </Text>
       <Text style={{ fontSize: 13, paddingTop: 2 }}>{`${item.building.localite}, ${item.building.npa}`} </Text>
       <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
     </CardSection>
   );

   renderLocalWithImageItem = (item, listLen) => (
     <CardSection >
       <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row' }}>
           <Image
             key={item.index}
             style={{ width: 60, height: 60 }}
             source={{ uri: this.state.base64Image }}
           />

           <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
             <Text style={{ fontSize: 18 }}>{`${item.attributes.LOC_CODE}, (${item.attributes.LOC_TYPE_DESIGNATION})`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>{`${item.attributes.ETG_DESIGNATION}, ${item.building.abreviation}, ${item.building.adresseLigne1}`} </Text>
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

   renderBuildingItem = (item, listLen) => (
     <CardSection>
       <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
         <View style={{ flexDirection: 'row' }}>
           <Image
             key={item.index}
             style={{ width: 60, height: 60 }}
             source={{ uri: this.state.base64Image }}
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
