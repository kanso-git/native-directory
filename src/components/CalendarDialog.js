/* eslint-disable consistent-return */
import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const AddCalendarEvent = NativeModules.AddCalendarEvent;

const presentCalendarEventDialog = eventConfig =>
  AddCalendarEvent.presentNewEventDialog(eventConfig);

const CalendarDialog = (options) => {
  if (Platform.OS === 'android') {
    // it seems unnecessary to check first, but if permission is manually disabled
    // the PermissionsAndroid.request will return granted (a RN bug?)
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR).then((hasPermission) => {
      if (hasPermission === true) {
        return presentCalendarEventDialog(options);
      }
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR)
        .then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return presentCalendarEventDialog(options);
          }
          return Promise.reject('permissionNotGranted');
        })
        .catch(err => Promise.reject(err));
    });
  }
  // ios permissions resolved within the native module
  return presentCalendarEventDialog(options);
};

export default CalendarDialog;
