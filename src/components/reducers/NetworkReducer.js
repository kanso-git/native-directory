/* eslint-disable consistent-return */
import * as types from './../actions/Types';

const INITIAL_STATE = {
  isConnected: true,
  error: null,
  service: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CONNECTION_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
