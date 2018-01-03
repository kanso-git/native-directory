import * as types from './../actions/Types';

const INITIAL_STATE = {
  searchQuery: '',
  searchResult: [],
  person: null,
  unit: null,
};

export default (state = INITIAL_STATE, action) => {
  console.log(`search reducer action : ${JSON.stringify(action, null, 2)}`);
  switch (action.type) {
    case types.SET_RESULT:
      return {
        ...INITIAL_STATE,
        searchQuery: action.payload.searchQuery,
        searchResult: action.payload.data.map(item => ({ ...item, key: item.id })),
      };
    case types.SET_PERSON:
    case types.SET_UNIT:
      return {
        ...state, ...action.payload,
      };
    default:
      return state;
  }
};
