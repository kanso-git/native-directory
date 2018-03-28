/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fa-icons';
import * as logging from './logging';

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
    height: 50,
    width: 100,
  },
  containerStyle: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearBtn: {
    fontSize: 25,
  },
});
// times-circle
const InputFlex = ({
  value,
  onChangeText,
  onClearText,
  spinner,
  onFocus = () => logging.log('onFocus is off'),
  onBlur = () => logging.log('onBlur is off'),
  icon, placeholder, autoFocus, secureTextEntry, style,
}) => {
  const { inputStyle, containerStyle } = styles;
  return (
    <View style={[containerStyle, style]}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        autoCorrect={false}
        placeholder={icon + placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        style={[inputStyle, style]}
      />
      {((value.length > 0 && !spinner) && onClearText) &&
        <TouchableOpacity onPress={() => onClearText()}>
          <Icon name="times-circle" style={styles.clearBtn} />
        </TouchableOpacity>
      }

    </View>
  );
};

export default InputFlex;
