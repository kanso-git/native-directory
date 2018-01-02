import * as types from './../actions/Types';

const INITIAL_STATE = {
  secret: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.STORE_SECRET:
      return { secret: action.payload.secret };
    default:
      return state;
  }
};
