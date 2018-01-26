import * as types from './../actions/Types';

const INITIAL_STATE = {
  building: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_BUILDING_LIST:
      return { ...action.payload };
    default:
      return state;
  }
};
