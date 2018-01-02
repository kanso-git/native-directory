import * as types from './../actions/Types';

const INITIAL_STATE = {
  searchQuery: '',
  searchResult: [],
};

export default (state = INITIAL_STATE, action) => {
  console.log(`search reducer ${action}`);
  switch (action.type) {
    case types.SET_RESULT:
      return {
        searchQuery: action.payload.searchQuery,
        searchResult: action.payload.data.map(item => ({ ...item, key: item.id })),
      };
    default:
      return state;
  }
};
