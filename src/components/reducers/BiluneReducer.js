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
    default:
      return state;
  }
};
