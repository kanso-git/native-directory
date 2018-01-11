import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import './I18n/I18n.js';
import { authActions } from './components/actions';
import reducers from './components/reducers';
import Router from './Router';

class App extends Component {
  componentDidMount() {
    this.myStore.dispatch(authActions.register());
  }
  myStore = null;
  render() {
    this.myStore = createStore(reducers, applyMiddleware(thunk));
    return (
      <Provider store={this.myStore} >
        <View style={{ flex: 1 }}>
          <Router />
        </View>
      </Provider>
    );
  }
}

export default App;
