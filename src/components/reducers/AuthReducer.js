import * as types from './../actions/Types';

const INITIAL_STATE = {
  secret: null,
  retryMax: 5,
  retry: 0,
};

export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case types.STORE_SECRET:
      return { ...state, secret: action.payload.secret };
    case types.RETRY:
      return { ...INITIAL_STATE, retry: state.retry + 1 };
    case types.RESET:
      return { ...INITIAL_STATE, secret: state.secret};
    default:
      return state;
  }
};
