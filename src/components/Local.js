/* eslint-disable react/prop-types,no-empty */
/* eslint global-require: "off" */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Animated, NativeModules } from 'react-native';
import Icon from 'react-native-fa-icons';
import Communications from 'react-native-communications';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { RESERVATION_EMPTY } from 'react-native-dotenv';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import { biluneActions } from './actions';
import { Card, CardSection, InputFlex, utile } from './common';
import LocalReservationItem from './LocalReservationItem';

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
    alignItems: 'center',
    justifyContent: 'center',
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
  onSaveEventInCalendar = (event) => {
    const debutUTC = utile.momentStatic.utc(event.debutUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const finUTC = utile.momentStatic.utc(event.finUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const {
      adresseLigne1, localite, npa,
    } = this.props.currentBuilding;

    const { LOC_TYPE_DESIGNATION, LOC_CODE, ETG_DESIGNATION } = this.props.localWithReservations.attributes;

    const eventConfig = {
      title: `${event.matiere} (${event.prof})`,
      startDate: debutUTC,
      endDate: finUTC,
      location: `${adresseLigne1} ${npa} ${localite}`,
      notes: `${LOC_TYPE_DESIGNATION} (${LOC_CODE})
${ETG_DESIGNATION}
${adresseLigne1}
${npa} ${localite}
  `,
    };

    AddCalendarEvent.presentNewCalendarEventDialog(eventConfig)
      .then((eventId) => {
        // handle success (receives event id) or dismissing the modal (receives false)
        if (eventId) {
          // console.warn(eventId);
        } else {
          // console.warn('dismissed');
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  onShowHideDay = (dateDay) => {
    this.props.showHideReservationDay(this.props.locId, dateDay);
  }
  onPressItem = (item) => {
    console.log(JSON.stringify(item, null, 4));
  };
  onSearch = (value) => {
    this.props.searchInLocalReservations(this.props.locId, value);
  }
  formatCalenderDate = () => {
    const moment = utile.momentStatic;
    return `${I18n.t('local.scheduleFrom')} ${moment().format('DD MMM')} ${I18n.t('local.scheduleTo')}  ${moment().add(7, 'd').format('DD MMM')}`;
  }
  flipCard = () => {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
  }


   renderItem = ({ item }) => (
     <LocalReservationItem
       item={item}
       visibleDays={this.props.visibleDays}
       style={{ paddingLeft: 10 }}
       listLen={this.props.localWithReservations.days.length}
       pressFn={this.onPressItem}
       showHideDay={this.onShowHideDay}
       saveEventInCalendar={this.onSaveEventInCalendar}
     />
   );

   render() {
     console.log(this.props.localWithReservations);
     const {
       adresseLigne1, localite, npa,
     } = this.props.currentBuilding;

     const { LOC_TYPE_DESIGNATION, LOC_CODE, ETG_DESIGNATION } = this.props.localWithReservations.attributes;


     return (
       <View>

         <View style={[styles.flipCard]}>
           <Image
             style={{ width: viewportWidth, height: viewportHeight * 0.33, backgroundColor: '#034d7c' }}
             source={{ uri: this.props.images[this.props.localWithReservations.attributes.OBJECTID] || utile.noImageIcon }}
           />
           <View >
             <TouchableOpacity
               style={{
              width: viewportWidth,
              paddingLeft: 5,
              paddingTop: 10,
              backgroundColor: '#DFDFDF',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
}}
               onPress={() => console.log(' show the map')}
             >
               <View style={[{ height: 24 }]}>
                 <Text style={[textStyle, touchable]}>{LOC_TYPE_DESIGNATION} ({LOC_CODE})</Text>
               </View>
               <View style={[{ marginBottom: 5, height: 40 }, touchableContainer]}>
                 <View style={addressStyle}>
                   <Text style={[touchable]}>{`${ETG_DESIGNATION}
${adresseLigne1}
${npa} ${localite}`}
                   </Text>
                 </View>
               </View>
             </TouchableOpacity>
           </View>
         </View>

         { (this.props.localWithReservations.days && this.props.localWithReservations.days.length > 0) &&
         <Card>
           <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
             <InputFlex
               icon="&#x1F50E;"
               style={{
              height: 40, borderRadius: 5, borderWidth: 1, borderColor: '#dfdfdf',
            }}
               placeholder={I18n.t('search.placeholderLocal')}
               value={this.props.localWithReservations.query}
               onChangeText={this.onSearch}
             />
           </CardSection>
           <TouchableOpacity onPress={() => Actions.push('sampleParallaxView')} >
             <Text>just for test</Text>
           </TouchableOpacity>
           <Text style={{
             paddingLeft: 5,
             paddingTop: 10,
             paddingBottom: 10,
             fontSize: 18,
            }}
           >{I18n.t('local.bookingSchedule')}: [{this.formatCalenderDate()}]
           </Text>
           <FlatList
             data={this.props.localWithReservations.query.length === 0 ? this.props.localWithReservations.days : this.props.localWithReservations.days.filter(d => d.typeoccupation !== RESERVATION_EMPTY)}
             extraData={this.props.visibleDays}
             renderItem={this.renderItem}
           />
         </Card>}
       </View>
     );
   }
}

const mapStateToProps = state => (
  {
    images: state.bilune.images,
    locId: state.bilune.locId,
    currentBuilding: state.bilune.buildings.find(b => b.id === state.bilune.id),
    localWithReservations: state.bilune.localWithReservations,
    visibleDays: state.bilune.localWithReservations.days.filter(f => !f.collapsed),
  }
);

export default connect(mapStateToProps, { ...biluneActions })(Local);
