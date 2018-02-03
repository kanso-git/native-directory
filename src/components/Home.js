/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import I18n from 'react-native-i18n';
import { Card, InputFlex, CardSection, Footer, Spinner, Chromatic } from './common';
import { authActions, searchActions, biluneActions } from './actions';
import SearchList from './SearchList';
import Slider from './Slider';
import MapPage from './MapPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchResultBox: {
    flex: 1,
    marginBottom: 40,
  },
  wrapperMapSlider: {
    flex: 1,
  },
  sliderBox: {
    flex: 5,
    justifyContent: 'center',
  },
  mapBox: {
    flex: 4,
  },
  resultText: {
    fontSize: 14,
    padding: 5,
  },
  spinnerWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
});
const {
  container,
  resultText,
  searchResultBox,
  spinnerWrapper,
  sliderBox,
  mapBox,
  wrapperMapSlider,
} = styles;

class Home extends Component {
  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { searchQuery } = nextProps.directory;

    if (secret == null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.search(searchQuery, secret);
      this.props.resetRetry();
    }
  }
  onSearch= (value) => {
    const { secret } = this.props.auth;
    this.props.search(value, secret);
    // new version 2.3.0 searchBilune
    this.props.searchBilune(value);
  }
  renderResultMessage= () => {
    const feedbackTranslated = I18n.t('search.feedback');
    const resultsTranslated = I18n.t('search.results');
    const resultTranslated = I18n.t('search.result');

    const { searchQuery } = this.props.directory;
    const { totalSearchResult } = this.props;

    if (searchQuery.length > 1) {
      let result = `${totalSearchResult.length + resultTranslated} `;
      if (totalSearchResult.length > 1) {
        result = `${totalSearchResult.length + resultsTranslated} `;
      }
      return (
        this.props.spinner ?
          <View style={spinnerWrapper}><Spinner size="small" /></View> :
          <Text style={resultText}>{feedbackTranslated + result} </Text>
      );
    }

    return null;
  }
  renderSectionJsx = text => (
    <View>
      <Text style={{
         fontSize: 18,
         padding: 5,
         backgroundColor: '#E5EFF5',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.5,
         elevation: 2,
       }}
      >
        {text}
      </Text>
      <Chromatic height={2} />
    </View>
  )
  renderFooter = () => (
    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
      <Footer
        footerTitle1=" Annuaire Version 2.3 - février 2018"
        footerTitle2=" © 2016 - 2018 SITEL - Université de Neuchâtel"
      />
    </View>
  )
  renderContent = () => {
    const { searchQuery } = this.props.directory;
    const entries = this.props.bilune.buildings ? this.props.bilune.buildings.map((b) => {
      b.image = this.props.bilune.images[b.id];
      return b;
    }) : null;
    const buildings = this.props.bilune.buildings ? this.props.bilune.buildings : null;

    if (searchQuery.length > 0 || !entries) {
      return (
        <View style={searchResultBox}>
          <Card><SearchList /></Card>
        </View>
      );
    } else if (entries && entries.length > 0 && buildings && buildings.length > 0) {
      return (
        <View style={wrapperMapSlider} >
          {this.renderSectionJsx('Bâtiments')}
          <View style={sliderBox}><Slider entries={entries} /></View>
          {this.renderSectionJsx('Carte')}
          <View style={mapBox}><MapPage /></View>
        </View>
      );
    }
  }

  renderSpinner = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spinner /></View> ;
  render() {
    const { searchQuery } = this.props.directory;
    return (
      <View style={container}>
        <Chromatic />
        <Card>
          <CardSection>
            <InputFlex
              icon="&#x1F50E;"
              placeholder={I18n.t('search.placeholder')}
              value={searchQuery}
              onChangeText={this.onSearch}
            />
          </CardSection>
          {this.renderResultMessage()}
        </Card>
        {this.renderContent()}
        {this.renderFooter()}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    directory: state.directory,
    auth: state.auth,
    spinner: state.directory.spinner,
    bilune: state.bilune,
    totalSearchResult: [...state.directory.searchResult,
      ...state.bilune.search.local,
      ...state.bilune.search.building],
    images: state.bilune.images,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions, ...biluneActions })(Home);
