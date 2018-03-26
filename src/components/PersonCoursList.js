/* eslint-disable react/prop-types,no-empty */
/* eslint global-require: "off" */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Platform } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { RESERVATION_EMPTY, RESERVATION_PIDHO } from 'react-native-dotenv';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-fa-icons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { pidhoActions } from './actions';
import { Card, CardSection, InputFlex, utile, Chromatic } from './common';
import * as logging from './common/logging';
import PersonCoursItem from './PersonCoursItem';

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
    paddingLeft: 0,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    flex: 11,
    height: 20,
    width: 150,
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

});


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const {
  textStyle,
  touchable,
  touchableContainer,
} = styles;

class PersonCoursList extends Component {
  onSaveEventInCalendar = (event) => {
    
    const debutUTC = utile.momentStatic.utc(event.debutUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const finUTC = utile.momentStatic.utc(event.finUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const { adresseLigne1, localite, npa } = event.building;
    const { LOC_TYPE_DESIGNATION, LOC_CODE, ETG_DESIGNATION } = event.local.attributes;
    const title = event.typeoccupation === RESERVATION_PIDHO ? `${event.matiere}  (${event.profs})` : `${event.matiere} (${event.profs})`;
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
        utile.trackEvent(categories.usr, actions.accl);
        if (eventId) {
          // logging.warn(eventId);
        } else {
          // logging.warn('dismissed');
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        if (error && error.code === 'permissionNotGranted') {
          utile.alterUser(I18n.t('global.calendarPermissionTitle'), I18n.t('global.calendarPermissionMsg'));
        }
      });
  };

  onShowHideDay = (dateDay) => {
    this.props.showHideCourseDay(this.props.id, dateDay);
  }
  onPressItem = (item) => {
    logging.log(JSON.stringify(item, null, 4));
  };
  onSearch = (value) => {
    this.props.searchInProfCours(this.props.id, value);
  }
  formatCalenderDate = () => {
    const moment = utile.momentStatic;
    return `${I18n.t('local.scheduleFrom')} ${moment().format('DD MMM')} ${I18n.t('local.scheduleTo')}  ${moment().add(7, 'd').format('DD MMM')}`;
  }
  renderPhones = phones => phones.map(phone => (
    <TouchableOpacity
      key={phone.external}
      style={{ paddingLeft: 15 }}
      onPress={() => utile.phonecall(phone.external, true)}
    >
      <Text style={[styles.textStyleElem, touchable]}>{phone.external}</Text>
    </TouchableOpacity>
  ));

  renderEmail = email => (
    <TouchableOpacity onPress={() => utile.email([email])}>
      <View style={[styles.containerStyle, touchableContainer]}>
        <Icon name="envelope" style={[styles.iconStyle, touchable]} allowFontScaling />
        <Text style={[styles.textStyleElem, touchable]}>{email} </Text>
      </View>
    </TouchableOpacity>
  );
   renderItem = ({ item }) => (
     <PersonCoursItem
       item={item}
       visibleDays={this.props.visibleDays}
       style={{ paddingLeft: 10 }}
       listLen={this.props.profCourses.days.length}
       pressFn={this.onPressItem}
       showHideDay={this.onShowHideDay}
       saveEventInCalendar={this.onSaveEventInCalendar}
     />
   );
   renderHeader = () => {
     const {
       lastName,
       firstName,
       email,
       phones,
     } = this.props;

     return (
       <View
         style={{
width: viewportWidth,
paddingLeft: 5,
paddingTop: 10,
backgroundColor: 'rgba(52, 52, 52, 0.5)',
justifyContent: 'flex-end',
alignItems: 'flex-start',
height: 90,
}}
       >
         <View style={[{ height: 25 }]}>
           <Text style={[textStyle, touchable]}>{firstName} {lastName}</Text>
         </View>
         <View style={[{ height: 30, width: viewportWidth }]}>
           { email && this.renderEmail(email)}
         </View>
         <View style={[{
                        height: 30,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        }]}
         >
           <Icon name="phone" style={{ fontSize: 18, paddingLeft: 5, color: '#fff' }} allowFontScaling />
           { phones ? this.renderPhones(phones) : <Text style={{ fontSize: 18, paddingLeft: 15, color: '#fff' }} > --</Text>}
         </View>
       </View>
     );
   }

   render() {
     const { onScroll = () => {} } = this.props;
     return (
       <ParallaxScrollView
         onScroll={onScroll}
         headerBackgroundColor="transparent"
         stickyHeaderHeight={90}
         parallaxHeaderHeight={(viewportHeight * 0.2) + 90}
         backgroundSpeed={10}
         keyboardShouldPersistTaps="always"
         keyboardDismissMode="on-drag"
         renderBackground={() => (
           <View key="background">
             <Chromatic />
             <Image
               style={{
                opacity: 0.4,
                width: viewportWidth,
                height: (viewportHeight * 0.2) + 90,
                backgroundColor: '#034d7c',
               }}
               source={{
            uri: utile.unineImgBig,
           }}
             />
             <View style={{
              position: 'absolute',
                                           top: 0,
                                           width: window.width,
                                           backgroundColor: 'rgba(52, 52, 52, 0.5)',
                                           height: (viewportHeight * 0.2),
             }}
             />

           </View>
          )}

         renderForeground={() => (
           <View key="parallax-header" style={[styles.parallaxHeader, { paddingTop: (viewportHeight * 0.2), width: viewportWidth }]}>
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
         { (this.props.profCourses.days
          && this.props.profCourses.days.length > 0) &&
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
                  placeholder={I18n.t('search.placeholderCourse')}
                  value={this.props.profCourses.query}
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
                data={this.props.profCourses.query.length === 0 ?
               this.props.profCourses.days :
               this.props.profCourses
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
    profCourses: state.pidho.profCourses,
    visibleDays: state.pidho.profCourses.days.filter(f => !f.collapsed),
  }
);

export default connect(mapStateToProps, { ...pidhoActions })(PersonCoursList);
