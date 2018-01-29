/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import I18n from 'react-native-i18n';
import { Card, InputFlex, CardSection, Footer, Spinner, Chromatic } from './common';
import { authActions, searchActions, biluneActions } from './actions';
import SearchList from './SearchList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchResultBox: {
    flex: 1,
    marginBottom: 40,
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
    this.props.searchBilune(value, this.props.bilune);
  }
  renderResultMessage= () => {
    const feedbackTranslated = I18n.t('search.feedback');
    const resultsTranslated = I18n.t('search.results');
    const resultTranslated = I18n.t('search.result');

    const { searchQuery } = this.props.directory;
    const { totalSearchResult } = this.props;
    console.log(JSON.stringify(totalSearchResult, null, 5));
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
  renderSpinner = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spinner /></View> ;
  render() {
    const { searchQuery } = this.props.directory;
    return (
      <View style={container}>
        <Chromatic />
        <Card>
          <CardSection>
            <InputFlex
              autoFocus
              icon="&#x1F50E;"
              placeholder={I18n.t('search.placeholder')}
              value={searchQuery}
              onChangeText={this.onSearch}
            />
          </CardSection>
          {this.renderResultMessage()}
        </Card>
        <View style={searchResultBox}><Card><SearchList /></Card></View>
        <View >
          <Footer
            footerTitle1=" Annuaire Version 2.3 - février 2018"
            footerTitle2=" © 2016 - 2018 SITEL - Université de Neuchâtel"
          />
        </View>
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
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions, ...biluneActions })(Home);
