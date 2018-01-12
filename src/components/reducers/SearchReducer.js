import * as types from './../actions/Types';

const INITIAL_STATE = {
  searchQuery: '',
  searchResult: [],
  person: null,
  unit: null,
  spinner: false,
};

export default (state = INITIAL_STATE, action) => {
  console.log(`search reducer action : ${JSON.stringify(action, null, 2)}`);
  switch (action.type) {
    case types.SET_QUERYSEARCH:
      return {
        ...state,
        searchQuery: action.payload.searchQuery,
      };
    case types.SET_RESULT:
      return {
        ...INITIAL_STATE,
        searchQuery: action.payload.searchQuery,
        searchResult: action.payload.data.map((item, index) => ({ ...item, key: item.id, index })),
      };
    case types.SHOW_SPINNER:
      return {
        ...state, ...action.payload,
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
