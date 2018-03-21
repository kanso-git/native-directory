import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Communications from 'react-native-communications';
import Icon from 'react-native-fa-icons';
import I18n from 'react-native-i18n';
import { CardSection } from './common';

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 1,
  },
  item: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
    height: 44,
  },
  description: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 13,
  },
  email: {
    paddingLeft: 10,
    paddingTop: -10,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

const AppInfosPage = () => (
  <ScrollView style={{ flex: 1 }}>
    <CardSection>
      <Text style={styles.item}>
        {I18n.t('global.title')}
      </Text>
    </CardSection>
    <CardSection style={{ flexDirection: 'column' }}>
      <Text style={styles.description} >
        {I18n.t('global.footerLine1')} {I18n.t('infos.general')}
      </Text>

      <Text style={styles.description} >
        {I18n.t('infos.intro')}
      </Text>

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ paddingLeft: 10 }} >{'\u2022'}</Text>
        <Text style={{ flex: 1, paddingLeft: 5 }}>{ I18n.t('infos.gLine1')}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ paddingLeft: 10 }} >{'\u2022'}</Text>
        <Text style={{ flex: 1, paddingLeft: 5 }}>{ I18n.t('infos.gLine2')}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ paddingLeft: 10 }} >{'\u2022'}</Text>
        <Text style={{ flex: 1, paddingLeft: 5 }}>{ I18n.t('infos.gLine3')}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ paddingLeft: 10 }} >{'\u2022'}</Text>
        <Text style={{ flex: 1, paddingLeft: 5 }}>{ I18n.t('infos.gLine4')}</Text>
      </View>

    </CardSection>
    <CardSection>
      <Text style={styles.description}>
        {I18n.t('infos.esri')}
      </Text>
    </CardSection>
    <CardSection>
      <Text style={styles.description}>
        {I18n.t('infos.google')}
      </Text>
    </CardSection>
    <CardSection>

      <TouchableOpacity onPress={() => Communications.email(['hotline.sitel@unine.ch'], null, null, ' ', ' ')}>
        <Text style={styles.description}>{I18n.t('infos.more')} :</Text>
        <CardSection >
          <Icon style={{ paddingLeft: 5 }} name="envelope" allowFontScaling />
          <Text style={styles.email}>hotline.sitel@unine.ch</Text>
        </CardSection>
      </TouchableOpacity>
    </CardSection>
  </ScrollView>
);

export default AppInfosPage;
