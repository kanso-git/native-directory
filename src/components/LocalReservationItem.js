/* eslint-disable react/prop-types,no-empty */
/* eslint global-require: "off" */

import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fa-icons';
import Dash from 'react-native-dash';
import { RESERVATION, RESERVATION_PIRES, RESERVATION_PIDHO, RESERVATION_EMPTY } from 'react-native-dotenv';

import I18n from 'react-native-i18n';

import { CardSection } from './common';

class LocalReservationItem extends Component {
  checkIfDayIsVisible = (days, dayDate) => {
    const currentDay = days.filter(f => f.date === dayDate);
    return !!currentDay.length;
  }

   switchOnType = (item, visibleDays, pressFn, listLen) => {
     switch (item.type) {
       case RESERVATION:
         return this.checkIfDayIsVisible(visibleDays, item.date) && this.renderReservationItem(item, listLen);
       default:
         break;
     }
   }

   formatDate = (date) => {
     const moment = require('moment');
     require('moment/locale/fr');
     moment.locale('fr');
     return moment(date, 'YYYY-MM-DD').format('dddd, LL');
   };

   renderDashed = (isEmpty, typeOcc) => (
     <View>
       <Dash
         dashThickness={4}
         dashLength={4}
         style={{
        width: 1,
        height: isEmpty ? 15 : 45,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: 'column',
    }}
       />
       <Icon
         name={typeOcc === RESERVATION_PIDHO ? 'graduation-cap' : 'dot-circle-o'}
         style={{
        fontSize: 20,
        paddingLeft: typeOcc === RESERVATION_PIDHO ? 1 : 4,
        paddingTop: typeOcc === RESERVATION_PIDHO ? 2 : 2,
        paddingBottom: 1,
     }}
       />

       <Dash
         dashThickness={4}
         dashLength={4}
         style={{
      width: 1,
      height: isEmpty ? 15 : 45,
      paddingRight: 10,
      paddingLeft: 10,
      flexDirection: 'column',
  }}
       />
     </View>
   )
   renderReservationBody = (item) => {
     switch (item.typeoccupation) {
       case RESERVATION_PIRES:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 5, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`De ${item.heure.split('-')[0]} à ${item.heure.split('-')[1]}`}  </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>Réserver pour: {`${item.matiere} ( ${item.prof} )`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>Remarque: {`${item.remarque}`} </Text>
           </View>
         );
       case RESERVATION_PIDHO:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 5, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`De ${item.heure.split('-')[0]} à ${item.heure.split('-')[1]}`}  </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>Matière: {`${item.matiere}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>Professeur: {`${item.prof}`} </Text>
           </View>
         );
       case RESERVATION_EMPTY:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 5, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Libre</Text>
           </View>
         );
       default:
         break;
     }
   }
  renderReservationItem = (item, listLen) => (
    <CardSection style={{ paddingTop: 1, paddingBottom: 0 }} >
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>

          { item.typeoccupation === RESERVATION_EMPTY ?
             this.renderDashed(true, item.typeoccupation) : this.renderDashed(false, item.typeoccupation)
          }

          { this.renderReservationBody(item)}
        </View>
      </View>
    </CardSection>
  );

   renderSectionJsx = (dayDate, visibleDays) => (
     <TouchableOpacity onPress={() => console.log('todo')}>
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
           name={this.checkIfDayIsVisible(visibleDays, dayDate) ? 'minus-circle' : 'plus-circle'}
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
           {this.formatDate(dayDate)}
         </Text>
       </CardSection>
     </TouchableOpacity>
   )
   renderSection = (item, visibleDays) => {
     if (item.section) {
       return this.renderSectionJsx(item.section, visibleDays);
     }
   }

   render() {
     const {
       item, pressFn, listLen, visibleDays,
     } = this.props;
     return (
       <View>
         { this.renderSection(item, visibleDays) }
         <TouchableOpacity onPress={() => pressFn(item)}>
           { this.switchOnType(item, visibleDays, pressFn, listLen) }
         </TouchableOpacity>
       </View>
     );
   }
}

export default LocalReservationItem;
