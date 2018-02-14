/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fa-icons';
import Dash from 'react-native-dash';
import { RESERVATION } from 'react-native-dotenv';

import I18n from 'react-native-i18n';

import { CardSection, Chromatic } from './common';

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
     return moment(date, 'YYYY-MM-DD').format('LL');
   };
  renderReservationItem = (item, listLen) => (
    <CardSection style={{ paddingTop: 1, paddingBottom: 0 }} >
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Dash
              dashThickness={4}
              dashLength={4}
              style={{
                  width: 1,
                  height: 100,
                  paddingRight: 10,
                  paddingLeft: 10,
                  flexDirection: 'column',
              }}
            />
          </View>
          <View style={{ flexDirection: 'column', paddingLeft: 5, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>Heure: {`${item.heure}`} </Text>
            <Text style={{ fontSize: 13, paddingTop: 2 }}>Matière: {`${item.matiere}`} </Text>
            <Text style={{ fontSize: 13, paddingTop: 5 }}>Professeur: {`${item.prof}`} </Text>
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


   renderSectionJsx = (dayDate, visibleDays) => (
     <TouchableOpacity onPress={() => console.log('todo')}>
       <CardSection style={{
       flexDirection: 'row',
       backgroundColor: '#E5EFF5',
       shadowColor: '#000',
       shadowOpacity: 0.5,
       elevation: 2,
        shadowOffset: { width: 0, height: 2 },
      }}
       >
         <Icon
           name={this.checkIfDayIsVisible(visibleDays, dayDate) ? 'minus-circle' : 'plus-circle'}
           style={{
        fontSize: 22,
        padding: 5,

      }}
         />
         <Text style={{
          fontSize: 18,
          padding: 5,

        }}
         >
           {this.formatDate(dayDate)}
         </Text>
         <Chromatic height={2} />
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
