/* eslint-disable react/prop-types,no-empty */
/* eslint global-require: "off" */
/* eslint-disable consistent-return */

import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fa-icons';
import Dash from 'react-native-dash';
import { RESERVATION, RESERVATION_PIRES, RESERVATION_PIDHO, RESERVATION_EMPTY, RESERVATION_PIDEX } from 'react-native-dotenv';

import I18n from 'react-native-i18n';

import { CardSection, utile } from './common';


class LocalReservationItem extends Component {
  checkIfDayIsVisible = (days, dayDate) => {
    const currentDay = days.filter(f => f.date === dayDate);
    return !!currentDay.length;
  }

   switchOnType = (item, visibleDays) => {
     switch (item.type) {
       case RESERVATION:
         return this.checkIfDayIsVisible(visibleDays, item.date)
         && this.renderReservationItem(item);
       default:
         break;
     }
   }

   formatDate = (date) => {
     const moment = utile.momentStatic;
     return moment(date, 'YYYY-MM-DD').format('dddd, LL');
   };

   renderOccupationIcon = (item) =>{

    if(item.typeoccupation === RESERVATION_PIDEX ){
      return (
        <Image
        style={{ width: 22, height: 20, marginLeft: 3, marginTop:5 , marginBottom:1}}
        source={{
     uri: utile.examIcon,
    }}
      />
      )
    }
    return (<Icon
    name={item.typeoccupation === RESERVATION_PIDHO ? 'graduation-cap' : 'dot-circle-o'}
    style={{
 fontSize: 20,
 color: '#034d7c',
 paddingLeft: item.typeoccupation === RESERVATION_PIDHO ? 1 : 4,
 paddingTop: item.typeoccupation === RESERVATION_PIDHO ? 2 : 2,
 paddingBottom: 1,
}}
  />)
   }
   renderDashed = (isEmpty, item) => (
     <View>
       <Dash
         dashThickness={4}
         dashLength={4}
         dashColor="#034d7c"
         style={{
        width: 1,
        height: isEmpty ? 15 : 55,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: 'column',
    }}
       />
       <TouchableOpacity onPress={() => !isEmpty && this.props.saveEventInCalendar(item)}>
        { this.renderOccupationIcon(item)}
       </TouchableOpacity>

       <Dash
         dashThickness={4}
         dashColor="#034d7c"
         dashLength={4}
         style={{
      width: 1,
      height: isEmpty ? 15 : 55,
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
 flexDirection: 'column', paddingLeft: 5, marginRight: 25, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 1 }}>{`${I18n.t('bookingItem.from')} ${item.heure.split('-')[0]} ${I18n.t('bookingItem.to')} ${item.heure.split('-')[1]}`}  </Text>
             <Text style={{ fontSize: 13, paddingTop: 2 }}>{I18n.t('bookingItem.for')}: {`${item.matiere} ( ${Array.isArray(item.prof) ? item.prof.join(', ') : item.prof} )`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5 }}>{I18n.t('bookingItem.remark')}: {`${item.remarque}`} </Text>
           </View>
         );
       case RESERVATION_PIDHO:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 25, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 1 }}>{`${I18n.t('bookingItem.from')} ${item.heure.split('-')[0]} ${I18n.t('bookingItem.to')} ${item.heure.split('-')[1]}`}  </Text>
             <Text style={{ fontSize: 13, paddingTop: 2, marginRight: 35 }}>{I18n.t('bookingItem.course')}: {`${item.matiere}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5, marginRight: 35 }}>{I18n.t('bookingItem.prof')}: {`${Array.isArray(item.prof) ? item.prof.join(', ') : item.prof}`} </Text>
           </View>
         );
         case RESERVATION_PIDEX:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 25, justifyContent: 'center',
}}
           >
             <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 1 }}>{`${I18n.t('bookingItem.from')} ${item.heure.split('-')[0]} ${I18n.t('bookingItem.to')} ${item.heure.split('-')[1]}`}  </Text>
             <Text style={{ fontSize: 13, paddingTop: 2, marginRight: 35 }}>{`${item.matiere}`} </Text>
             <Text style={{ fontSize: 13, paddingTop: 5, marginRight: 35 }}>{I18n.t('bookingItem.building')}: {`${Array.isArray(item.prof) ? item.prof.join(', ') : item.prof}`} </Text>
           </View>
         );
       case RESERVATION_EMPTY:
         return (
           <View style={{
 flexDirection: 'column', paddingLeft: 5, marginRight: 5, justifyContent: 'center',
}}
           >
             <Text style={{ paddingLeft: 5, fontSize: 16, fontWeight: 'bold' }}>{I18n.t('bookingItem.free')}</Text>
           </View>
         );
       default:
         break;
     }
   }


   renderSaveToCalendar = item => (
     <View style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
           }}
     >
       <TouchableOpacity onPress={() => this.props.saveEventInCalendar(item)}>
         <Image
           style={{ width: 28, height: 30, marginBottom: 5 }}
           source={{ uri: utile.addToCalendarIcon }}
         />
       </TouchableOpacity>
     </View>
   )


  renderReservationItem = item => (
    <CardSection style={{ paddingTop: 1, paddingBottom: 0 }} >
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>

          { item.typeoccupation === RESERVATION_EMPTY ?
             this.renderDashed(true, item) :
              this.renderDashed(false, item)
          }

          { this.renderReservationBody(item)}
        </View>
      </View>
      {item.typeoccupation !== RESERVATION_EMPTY && this.renderSaveToCalendar(item)}
    </CardSection>
  );

   renderSectionJsx = (dayDate, visibleDays) => (
     <TouchableOpacity onPress={() => this.props.showHideDay(dayDate)}>
       <CardSection style={{
       flexDirection: 'row',
       backgroundColor: '#DFDFDF',
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
        color: '#034d7c',
        padding: 0,
        paddingLeft: 2,
        paddingRight: 5,
      }}
         />
         <Text style={{
          fontSize: 18,
          padding: 0,
          color: '#034d7c',
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
       item, pressFn, visibleDays,
     } = this.props;
     return (
       <View>
         { this.renderSection(item, visibleDays) }
         { this.switchOnType(item, visibleDays, pressFn) }
       </View>
     );
   }
}

export default LocalReservationItem;
