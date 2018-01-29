import * as types from './../actions/Types';

const INITIAL_STATE = {
  state: null,
  building: [],
  search: {
    local: [],
    building: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_BILUNE_STATE:
      return { ...state, ...action.payload };
    case types.GET_BUILDING_LIST:
      return { ...state, ...action.payload };
    case types.SET_SEARCH_BILUNE:
      return { ...state, ...action.payload };
    case types.RESET_SEARCH_BILUNE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
