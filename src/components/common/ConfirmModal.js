/* eslint-disable react/prop-types,no-empty */
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    justifyContent: 'center',

  },
  sectionStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5,
  },
  modalStyle: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
});
const ConfirmModal = ({
  children, visible, onConfirm, onCancel,
}) => (

  <Modal
    visible={visible}
    animationType="slide"
    transparent
    presentationStyle="overFullScreen"
  >
    <View style={styles.modalStyle}>
      <View style={styles.containerStyle}>
        <View style={styles.sectionStyle}>
          <Text style={styles.textStyle} > { children }</Text>
        </View>
        <View style={[styles.sectionStyle]}>
          <TouchableOpacity style={styles.btnStyle} onPress={() => onConfirm()}>
            <Text style={styles.textStyle}> Ok </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStyle} onPress={() => onCancel()}>
            <Text style={styles.textStyle}> Cancel </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
export default ConfirmModal;
