import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

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
});

const InputFlex = ({ value, onChangeText,icon, placeholder, autoFocus, secureTextEntry}) => {
  const { inputStyle, containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        autoCorrect={false}
        placeholder={icon + placeholder}
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
      />
    </View>
  );
};

export default InputFlex;
