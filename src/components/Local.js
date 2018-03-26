/* eslint-disable react/prop-types,no-empty */
/* eslint global-require: "off" */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Platform } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { RESERVATION_EMPTY, RESERVATION_PIDHO } from 'react-native-dotenv';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Actions } from 'react-native-router-flux';
import { biluneActions } from './actions';
import { Card, CardSection, InputFlex, utile, Chromatic } from './common';
import * as logging from './common/logging';
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
    color: 'white',
  },
  touchableContainer: {
    marginBottom: 15,
  },
  addressStyle: {
    paddingLeft: 5,
    paddingBottom: 10,
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
  info: {
    position: 'absolute',
    top: 20,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 6,
    borderRadius: 10,
    width: 120,
    height: 40,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
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
    const localObjId = this.props.localWithReservations.attributes.OBJECTID;
    const localId = this.props.localWithReservations.attributes.LOC_ID;
    if (!this.props.images[localObjId]) {
      // TODO load local the image
      this.props.loadLocalImageById(localObjId, localId);
    }
  }
  componentDidMount() {

  }
  onSaveEventInCalendar = (event) => {
    const debutUTC = utile.momentStatic.utc(event.debutUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const finUTC = utile.momentStatic.utc(event.finUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const {
      adresseLigne1, localite, npa,
    } = this.props.currentBuilding;

    const { LOC_TYPE_DESIGNATION, LOC_CODE, ETG_DESIGNATION } =
    this.props.localWithReservations.attributes;

    const title = event.typeoccupation === RESERVATION_PIDHO ? `${event.matiere}  (${event.prof})` : `${event.matiere} (${event.prof})`;
    const fomrattedTitle = title.length > 40 ? `${title.substr(0, 39)} ...` : title;
    const noteText = `${title}

${LOC_TYPE_DESIGNATION} - ${LOC_CODE}
${ETG_DESIGNATION}
${adresseLigne1}
${npa} ${localite}`;

    const eventConfig = {
      title: fomrattedTitle,
      startDate: debutUTC,
      endDate: finUTC,
      location: `${adresseLigne1} ${npa} ${localite}`,
      notes: noteText,
      description: noteText,
    };

    AddCalendarEvent.presentNewCalendarEventDialog(eventConfig)
      .then((eventId) => {
        // handle success (receives event id) or dismissing the modal (receives false)
        const { categories, actions } = utile.gaParams;
        const action = event.typeoccupation === RESERVATION_PIDHO ? actions.accl : actions.aecl;
        utile.trackEvent(categories.usr, action);
        if (eventId) {
          // logging.warn(eventId);
        } else {
          // logging.warn('dismissed');
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        logging.warn(error);
      });
  };

  onShowHideDay = (dateDay) => {
    this.props.showHideReservationDay(this.props.locId, dateDay);
  }
  onPressItem = (item) => {
    logging.log(JSON.stringify(item, null, 4));
  };
  onSearch = (value) => {
    this.props.searchInLocalReservations(this.props.locId, value);
  }
  formatCalenderDate = () => {
    const moment = utile.momentStatic;
    return `${I18n.t('local.scheduleFrom')} ${moment().format('DD MMM')} ${I18n.t('local.scheduleTo')}  ${moment().add(7, 'd').format('DD MMM')}`;
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
   renderHeader = () => {
     const {
       adresseLigne1, localite, npa,
     } = this.props.currentBuilding;
     let salleplaces = '';
     if (this.props.localWithReservations.salleplaces) {
       salleplaces = `${this.props.localWithReservations.salleplaces} ${I18n.t('local.salleplaces')}`;
     }

     const { LOC_TYPE_DESIGNATION, LOC_CODE, ETG_DESIGNATION } =
    this.props.localWithReservations.attributes;
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
          Actions.push('mapPage', { buildingId: this.props.currentBuilding.id, localId: this.props.locId });
          }}
       >
         <View style={[{ height: 24, flexDirection: 'row' }]}>
           <Text style={[textStyle, touchable]}>{LOC_TYPE_DESIGNATION}  {LOC_CODE}</Text>
           <Text style={[touchable, { paddingRight: 10, paddingTop: 4, textAlignVertical: 'bottom' }]}>{salleplaces}</Text>
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
     );
   }

   render() {
     const localObjectId = this.props.localWithReservations.attributes.OBJECTID;
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
               source={{
            uri: this.props.images[localObjectId] || utile.noImageIcon,
           }}
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
         { (this.props.localWithReservations.days
          && this.props.localWithReservations.days.length > 0) &&
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
                  placeholder={I18n.t('search.placeholderLocal')}
                  value={this.props.localWithReservations.query}
                  onChangeText={this.onSearch}
                />
              </CardSection>
              <Text style={{
             paddingLeft: 5,
             paddingTop: 10,
             paddingBottom: 10,
             fontSize: 18,
            }}
              >{I18n.t('local.bookingSchedule')} [{this.formatCalenderDate()}]
              </Text>
              <FlatList
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                data={this.props.localWithReservations.query.length === 0 ?
               this.props.localWithReservations.days :
               this.props.localWithReservations
               .days.filter(d => d.typeoccupation !== RESERVATION_EMPTY)}
                extraData={this.props.visibleDays}
                renderItem={this.renderItem}
              />
            </Card>
          </View>}
       </ParallaxScrollView>
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
