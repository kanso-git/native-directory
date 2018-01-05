/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import { Card, InputFlex, CardSection, Footer } from './common';
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
});

const {
  container,
  resultText,
  searchResultBox,
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
  renderResultMessage = () => {
    const { searchQuery, searchResult } = this.props.directory;
    if (searchQuery.length > 2) {
      let result = `${searchResult.length} résultat`;
      if (searchResult.length > 1) {
        result = `${searchResult.length} résultats`;
      }
      return (
        <Text style={resultText}>Nous avons trouvé {result} </Text>
      );
    }
  }
  render() {
    console.log('------------ render -----------');
    const { secret, retry } = this.props.auth;
    const { searchQuery } = this.props.directory;
    console.log(`render secret:${secret}
    retry:${retry}`);

    return (
      <View style={container}>
        <Card>
          <CardSection>
            <InputFlex
              autoFocus
              placeholder="&#x1F50E; Personne, département, n° de tél..."
              value={searchQuery}
              onChangeText={this.onSearch}
            />
          </CardSection>
          {this.renderResultMessage()}
        </Card>
        <View style={searchResultBox}>
          <Card>
            <SearchList />
          </Card>
        </View>
        <View >
          <Footer
            footerTitle1=" Annuaire Version 2.2 - janvier 2018"
            footerTitle2=" © 2018 SITEL - Université de Neuchâtel"
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ directory: state.directory, auth: state.auth });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(Home);
