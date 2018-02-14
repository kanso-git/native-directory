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
  reservations: {},
  localWithReservations: {},
  id: null,
  localId: null,
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
    case types.SET_RESERVATIONS_BILUNE_LOCALS:
      return { ...state, reservations: action.payload.reservations };
    case types.RESET_SEARCH_BILUNE:
      return { ...state, search: INITIAL_STATE.search };
    case types.SET_DEFAULT_BAT_ID:
      return { ...state, ...action.payload };
    case types.SET_DEFAULT_LOC_ID:
      return { ...state, ...action.payload };
    case types.ENRICH_BILUNE_BUILDING:
      return { ...state, ...action.payload };
    case types.ENRICH_BILUNE_LOCAL_RESERVATIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
