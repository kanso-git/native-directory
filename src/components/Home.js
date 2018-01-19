/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import I18n from 'react-native-i18n';
import { Card, InputFlex, CardSection, Footer, Spinner, Chromatic } from './common';
import { authActions, searchActions } from './actions';
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
    console.log(`componentWillReceiveProps secret:${secret}, retry:${retry}, screen:${screen}`);
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
  }
  renderResultMessage= () => {
    const feedbackTranslated = I18n.t('search.feedback');
    const resultsTranslated = I18n.t('search.results');
    const resultTranslated = I18n.t('search.result');

    const { searchQuery, searchResult } = this.props.directory;
    if (searchQuery.length > 2) {
      let result = `${searchResult.length + resultTranslated} `;
      if (searchResult.length > 1) {
        result = `${searchResult.length + resultsTranslated} `;
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
    const { secret, retry } = this.props.auth;
    const { searchQuery, spinner } = this.props.directory;
    console.log(`render secret:${secret}
    retry:${retry} , spinner:${spinner}`);

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
            footerTitle1=" Annuaire Version 2.2 - janvier 2018"
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
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(Home);
