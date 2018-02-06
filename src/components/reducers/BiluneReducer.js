import * as types from './../actions/Types';
// images:{objectId:data,}
const INITIAL_STATE = {
  state: null,
  buildings: [],
  locals: [],
  search: {
    local: [],
    building: [],
  },
  images: {},
  id: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_BILUNE_STATE:
      return { ...state, ...action.payload };
    case types.SET_BILUNE_DATA:
      return { ...state, ...action.payload };
    case types.SET_SEARCH_BILUNE:
      return { ...state, ...action.payload };
    case types.SET_IMAGE_BILUNE:
      return { ...state, images: action.payload.images };
    case types.RESET_SEARCH_BILUNE:
      return { ...state, search: INITIAL_STATE.search };
    case types.SET_DEFAULT_BAT_ID:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
