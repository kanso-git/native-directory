import * as types from './../actions/Types';

const INITIAL_STATE = {
  searchQuery: '',
  searchResult: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SEARCH_CHANGE:
      return { searchQuery: action.payload.searchQuery };
    default:
      return state;
  }
};
