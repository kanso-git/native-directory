/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint global-require: "off" */

import axios from 'axios';
import * as _ from 'lodash';
import { BDL_SECURITY_TOKEN,
  BDL_SECURITY_TOKEN_VAL,
  API_BDL, LOCAL, BUILDING,
  BDL_LOADED,
  BDL_LOADING,
  RESERVATION,
  RESERVATION_NA,
  RESERVATION_EMPTY,
  BDL_ERROR } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';
import * as statics from '../common/static';

const headers = {};
headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;

// filters
const filterGeometryForBuilding = (enteries, bId) => enteries
  .filter(e => e.attributes.BAT_ID === bId)
  .map(f => f.geometry);

const filterBuildingById = (blArr, id) => blArr.filter(b => b.id === id)[0];

const getImageUsingBlob = async (url) => {
  try {
    const RNFetchBlob = require('react-native-fetch-blob').default;
    const res = await RNFetchBlob.fetch('GET', url, {
      ...headers,
    });
    const mimetype = 'image/jpg';
    const base64Str = res.base64();
    return (res.base64() && res.base64().length > 0) ?
      `data:${mimetype};base64,${base64Str}` : statics.noImageIcon;
  } catch (e) {
    console.error(`error occured getImageUsingBlob ${e}`);
    throw e;
  }
};

const getBdlBuildingListAxios = async () => {
  let res;
  try {
    res = await axios.get(queries.bdlBuildings(), { headers });
    return res.data;
  } catch (e) {
    console.error(`error occured getBdlBuildingFloorsAxios ${e}`);
    throw e;
  }
};

const getBdlBuildingFloorsAxios = async (floorBuildingId) => {
  let res;
  try {
    res = await axios.get(queries.bdlBuildingFloors(floorBuildingId), { headers });
    const collapsed = false;
    return res.data.map(f => ({ ...f, collapsed }));
  } catch (e) {
    console.error(`error occured getBdlBuildingFloorsAxios ${e}`);
    throw e;
  }
};

const getBiluneLocalsWithSpatialDataAxios = async () => {
  try {
    const locals = await axios.get(queries.locals('BAT_ID>0'));
    console.info(`found ${locals.data.features.length} locals`);
    return locals.data.features;
  } catch (e) {
    console.error(`error getBiluneLocalsWithSpatialDataAxios ${e}`);
    throw e;
  }
};

const getBiluneBuildingEnteriesAxios = async () => {
  let res;
  try {
    res = await axios.get(queries.buildingsEnteries());
    return res.data ? res.data.features : res.data;
  } catch (e) {
    console.error(`error getBiluneBuildingEnteriesAxios ${e}`);
    throw e;
  }
};

const loadSpatialData = () =>

  async (dispatch, getState) => {
    const start = new Date().getTime();
    dispatch({
      type: types.CHANGE_BILUNE_STATE,
      payload: {
        state: BDL_LOADING,
      },
    });

    try {
      const bdlBuildings = await getBdlBuildingListAxios();
      // const biluneBuildings = await getBiluneBuildingListAxios();
      const buildingsEnteries = await getBiluneBuildingEnteriesAxios();

      const buildings = bdlBuildings.map((b) => {
        const enteries = filterGeometryForBuilding(buildingsEnteries, b.id);
        // const geometry = filterGeometryForBuilding(biluneBuildings, b.id);
        return { ...b, enteries };
      });
      dispatch({
        type: types.SET_BILUNE_DATA,
        payload: {
          buildings,
          locals: [],
        },
      });
      // load building images for home slider
      const { images } = getState().bilune;
      const imagesPromise = [];
      const imagesId = [];
      buildings.forEach((b) => {
        // image is not loaded
        if (!images[b.id]) {
          imagesId.push(b.id);
          imagesPromise.push(getImageUsingBlob(`${API_BDL}/batiments/${b.id}/photo/mini`));
        }
      });
      console.info(`loadSpatialData loading images for ${imagesId.length} buildings`);
      if (imagesId.length > 0) {
        Promise.all(imagesPromise).then((imagesData) => {
          // handle image stocking
          imagesId.forEach((id, i) => {
            images[id] = imagesData[i];
          });
          dispatch({
            type: types.SET_IMAGE_BILUNE,
            payload: { images },
          });
        }).catch(err => console.error(`err loading image:${err}`));
      }
      // const locals = await getBiluneLocalsOneByOneAxios(bdlBuildings);
      const locals = await getBiluneLocalsWithSpatialDataAxios();

      dispatch({
        type: types.SET_BILUNE_DATA,
        payload: {
          buildings,
          locals,
        },
      });

      dispatch({
        type: types.CHANGE_BILUNE_STATE,
        payload: {
          state: BDL_LOADED,
        },
      });
      const end = new Date().getTime();
      const time = end - start;
      console.info(`loadSpatialData loading time: ${time}`);
    } catch (e) {
      dispatch({
        type: types.CHANGE_BILUNE_STATE,
        payload: {
          state: BDL_ERROR,
        },
      });
      if (e.response) {
        if (e.response.status === 401) {
          console.error(`Error getBuildingList ${e} `);
        }
      }
    }
  };

const formatedBuildingDataForList = (myBuilding) => {
  // handle data formating
  const locals = [];
  let building = {};

  if (myBuilding && myBuilding.locals && myBuilding.floors) {
    myBuilding.floors.forEach((b) => {
      const localsPerFloor = myBuilding
        .locals.filter(l => parseInt(l.attributes.ETG_ID, 10) === b.id);
      if (localsPerFloor.length > 0) {
        const section = localsPerFloor[0].attributes.ETG_DESIGNATION;
        localsPerFloor[0].attributes.section = section;
        locals.push(...localsPerFloor);
      }
    });

    building = {
      ...myBuilding,
      locals: locals.map((item, index) => ({
        ...item, type: LOCAL, key: item.attributes.LOC_ID, index,
      })),
    };
  } else {
    building = { ...myBuilding };
  }
  return building;
};
const reservationListAxios = async (lId, sD, eD) => {
  const url = queries.reservationsByLocalId(lId, sD, eD);
  console.info(`url reservationListAxios ${url}`);
  const res = await axios.get(url);
  return res.data;
};

const formatedLocalReservationDataForList = (myLocal) => {
  const moment = statics.momentStatic;
  if (myLocal && myLocal.days) {
    const formattedDays = [];
    let num = 0;
    const missingDays = [];
    while (num < 8) {
      const date = moment().add(num, 'd').format('YYYY-MM-DD');
      const missingDayIndex = _.findIndex(myLocal.days, o => o.date === date);
      if (missingDayIndex === -1) {
        missingDays.push({
          date,
          occupation: {
            date,
            typeoccupation: RESERVATION_EMPTY,
            debutUTC: moment().add(num, 'd').format(moment().ISO_8601),
          },
        });
      }
      num += 1;
    }
    const alldays = [...myLocal.days, ...missingDays];

    alldays.forEach((d) => {
      const section = d.date;
      if ((d.occupation && d.occupation.length > 0)) {
        const occupations = d.occupation.sort((o1, o2) => {
          // "debutUTC": "2018-02-14T08:15:00Z",
          const a = moment(o1.debutUTC, moment.ISO_8601);
          const b = moment(o2.debutUTC, moment.ISO_8601);
          const res = a.diff(b) > 0 ? 1 : -1;
          return res;
        });
        occupations.forEach((oc, i) => {
          if (i === 0) {
            formattedDays.push({ ...oc, section, collapsed: false });
          } else {
            formattedDays.push({ ...oc });
          }
        });
      } else if (_.isObject(d.occupation)) {
        formattedDays.push({ ...d.occupation, section, collapsed: false });
      }
    });

    const formattedDaysSorted = formattedDays.sort((o1, o2) => {
      // "debutUTC": "2018-02-14T08:15:00Z",
      const a = moment(o1.date, 'YYYY-MM-DD');
      const b = moment(o2.date, 'YYYY-MM-DD');
      if (a.diff(b) > 0) {
        return 1;
      } else if (a.diff(b) === 0) {
        return o1.secrtion ? 0 : 1;
      }
      return -1;
    });

    return {
      ...myLocal,
      days: formattedDaysSorted.map((item, index) => ({
        ...item, type: RESERVATION, key: index, index,
      })),
    };
  }

  return myLocal;
};

const completeLoadingLocalData = (localId, dataReservations, dispatch, getState) => {
  const { reservations } = getState().bilune;
  const days = dataReservations.Query.Horaire.jour ? dataReservations.Query.Horaire.jour : [];
  reservations[localId] = days;
  const dataLocals = getState().bilune.locals;
  dataLocals.forEach((currLocal) => {
    if (parseInt(currLocal.attributes.LOC_ID, 10) === localId) {
      const localWithReservations = formatedLocalReservationDataForList({
        ...currLocal, days, query: '',
      });

      dispatch({
        type: types.ENRICH_BILUNE_LOCAL_RESERVATIONS,
        payload: { localWithReservations, reservations },
      });
    }
  });
};
const loadAllLocalData = localId =>
  async (dispatch, getState) => {
    const moment = statics.momentStatic;
    const now = moment();
    const startDate = now.format('YYYY-MM-DD');
    const endDate = now.add(7, 'd').format('YYYY-MM-DD');
    const { reservations } = getState().bilune;

    if (reservations && reservations[localId]) {
      // up to date
      // addintional check to be done mainly if request was on error or start date is < today
    } else {
      try {
        const dataReservations = await reservationListAxios(localId, startDate, endDate);
        completeLoadingLocalData(localId, dataReservations, dispatch, getState);
      } catch (e) {
        // todo add default message when an error is occured like reservation data is not available!
        const dataLocals = getState().bilune.locals;
        dataLocals.forEach((currLocal) => {
          if (parseInt(currLocal.attributes.LOC_ID, 10) === localId) {
            const localWithReservations = { ...currLocal, days: [], query: '' };
            reservations[localId] = RESERVATION_NA;
            dispatch({
              type: types.ENRICH_BILUNE_LOCAL_RESERVATIONS,
              payload: { localWithReservations, reservations },
            });
          }
        });
      }
    }
  };


const loadAllBuildingData = buildingId =>
  async (dispatch, getState) => {
    try {
      const floors = await getBdlBuildingFloorsAxios(buildingId);
      const dataLocals = getState().bilune.locals;
      const { images } = getState().bilune;
      let locals = [];

      if (getState().bilune.state === BDL_LOADED) {
        locals = dataLocals.filter((l) => {
          const builId = l.attributes.BAT_ID;
          if (builId === buildingId) {
            return true;
          }
          return false;
        });

        const imagesPromise = [];
        const imagesId = [];
        locals.forEach((loc) => {
        // image is not loaded
          const typeCode = loc.attributes.LOC_TYPE_ID;
          if (!images[loc.attributes.OBJECTID] &&
              ((typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3))) {
            imagesId.push(loc.attributes.OBJECTID);
            imagesPromise.push(getImageUsingBlob(`${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
          }
        });
        console.info(`loadAllBuildingData loading images for ${imagesId.length} locals`);
        if (imagesId.length > 0) {
          Promise.all(imagesPromise).then((imagesData) => {
          // handle image stocking
            imagesId.forEach((id, i) => {
              images[id] = imagesData[i];
            });
            dispatch({
              type: types.SET_IMAGE_BILUNE,
              payload: { images },
            });
          }).catch(err => console.error(`err loading image:${err}`));
        }

        const dataBuildings = getState().bilune.buildings;
        const buildings = [];
        dataBuildings.forEach((currBuilding) => {
          if (currBuilding.id === buildingId) {
            const buidlingFormated = formatedBuildingDataForList({
              ...currBuilding, locals, floors, query: '',
            });
            buildings.push(buidlingFormated);
          } else {
            buildings.push(currBuilding);
          }
        });

        dispatch({
          type: types.ENRICH_BILUNE_BUILDING,
          payload: { buildings },
        });
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          console.error(`Error buildingFloors ${e} `);
        }
      }
    }
  };

const showHideBuildingFloor = (buildingId, floorId) =>
  async (dispatch, getState) => {
    const dataBuildings = getState().bilune.buildings;
    const buildings = [];
    dataBuildings.forEach((currBuilding) => {
      if (currBuilding.id === buildingId) {
        const floors = currBuilding.floors.map((f) => {
          if (f.id === floorId) {
            const collapsed = !f.collapsed;
            return { ...f, collapsed };
          }
          return f;
        });
        // currBuilding.floors = floors;
        buildings.push({ ...currBuilding, floors });
      } else {
        buildings.push(currBuilding);
      }
    });

    dispatch({
      type: types.ENRICH_BILUNE_BUILDING,
      payload: { buildings },
    });
  };

const searchInBuilding = (buildingId, searchQuery) =>
  async (dispatch, getState) => {
    const dataBuildings = getState().bilune.buildings;
    const buildings = [];
    let buildingsLocals = [];

    dataBuildings.forEach((currBuilding) => {
      if (currBuilding.id === buildingId) {
        const dataLocals = getState().bilune.locals;
        buildingsLocals = dataLocals.filter((l) => {
          const builId = l.attributes.BAT_ID;
          if (builId === buildingId) {
            return true;
          }
          return false;
        });

        const locals = buildingsLocals.filter((l) => {
          const locCode = l.attributes.LOC_CODE.toLowerCase();
          const typeDes = l.attributes.LOC_TYPE_DESIGNATION.toLowerCase();
          const q = searchQuery.toLowerCase();
          const typeCode = l.attributes.LOC_TYPE_ID;
          if (typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3) {
            return locCode.includes(q) || typeDes.includes(q);
          }
          return locCode.includes(q);
        });

        const tobeFormatted = { ...currBuilding, query: searchQuery, locals };
        const formated = formatedBuildingDataForList(tobeFormatted);
        // expaned the floors after the search
        const expanded = formated.floors.map(f => ({ ...f, collapsed: false }));
        buildings.push({ ...formated, floors: expanded });
      } else {
        buildings.push(currBuilding);
      }
    });

    dispatch({
      type: types.ENRICH_BILUNE_BUILDING,
      payload: { buildings },
    });
  };

const searchBilune = query =>
  async (dispatch, getState) => {
    const dataBuildings = getState().bilune.buildings;
    const dataLocals = getState().bilune.locals;
    const { images } = getState().bilune;
    const search = {};
    let buildings = [];
    let locals = [];

    if (query && query.trim().length > 1) {
    // search bilune building minimum query length is 3
      dispatch({
        type: types.RESET_SEARCH_BILUNE,
      });

      if (query.trim().length > 2) { // only start search when query >2
        const q = query.toLowerCase();
        if (q === 'unine') { // special case load all the building when unine is entered
          buildings = dataBuildings;
        } else {
          buildings = dataBuildings.filter((b) => {
            const abreviation = b.abreviation.toLowerCase();
            const adresseLigne1 = b.adresseLigne1.toLowerCase();
            return abreviation.includes(q) || adresseLigne1.includes(q);
          });
        }
        const imagesPromise = [];
        const imagesId = [];
        buildings.forEach((b) => {
          // image is not loaded
          if (!images[b.id]) {
            imagesId.push(b.id);
            imagesPromise.push(getImageUsingBlob(`${API_BDL}/batiments/${b.id}/photo/mini`));
          }
        });
        console.info(`searchBilune loading images for ${imagesId.length} buildings`);
        if (imagesId.length > 0) {
          Promise.all(imagesPromise).then((imagesData) => {
            // handle image stocking
            imagesId.forEach((id, i) => {
              images[id] = imagesData[i];
            });
            dispatch({
              type: types.SET_IMAGE_BILUNE,
              payload: { images },
            });
          }).catch(err => console.error(`err loading image:${err}`));
        }
      }
      // as we can find local with length 2
      if (getState().bilune.state === BDL_LOADED) {
        locals = dataLocals.filter((l) => {
          const locCode = l.attributes.LOC_CODE.toLowerCase();
          const typeDes = l.attributes.LOC_TYPE_DESIGNATION.toLowerCase();
          const q = query.toLowerCase();
          const typeCode = l.attributes.LOC_TYPE_ID;
          if (typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3) {
            return locCode.includes(q) || typeDes.includes(q);
          }
          return locCode.includes(q);
        });

        const imagesPromise = [];
        const imagesId = [];
        locals.forEach((loc) => {
          // image is not loaded
          const typeCode = loc.attributes.LOC_TYPE_ID;
          if (!images[loc.attributes.OBJECTID] &&
            ((typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3))) {
            imagesId.push(loc.attributes.OBJECTID);
            imagesPromise.push(getImageUsingBlob(`${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
          }
        });
        console.info(`searchBilune loading images for ${imagesId.length} locals`);
        if (imagesId.length > 0) {
          Promise.all(imagesPromise).then((imagesData) => {
            // handle image stocking
            imagesId.forEach((id, i) => {
              images[id] = imagesData[i];
            });
            dispatch({
              type: types.SET_IMAGE_BILUNE,
              payload: { images },
            });
          }).catch(err => console.error(`err loading image:${err}`));
        }
      }

      if (query.length > 1 && locals.length > 0) {
        search[LOCAL] = locals.map((l, index) => ({
          ...l,
          type: LOCAL,
          key: l.attributes.LOC_ID,
          building: filterBuildingById(dataBuildings, l.attributes.BAT_ID),
          subIndex: index,

        }));
      } else {
        search[LOCAL] = [];
      }

      if (query.length > 2 && buildings.length > 0) {
        search[BUILDING] = buildings.map((b, index) => ({
          ...b, type: BUILDING, key: b.id, subIndex: index,
        }));
      } else {
        search[BUILDING] = [];
      }
      return dispatch({
        type: types.SET_SEARCH_BILUNE,
        payload: {
          search,
        },
      });
    }
    console.info(`don't search query is:${query}`);
    return dispatch({
      type: types.RESET_SEARCH_BILUNE,
      payload: {
        search,
      },
    });
  };

const setBuildingId = ({ id }) => ({ type: types.SET_DEFAULT_BAT_ID, payload: { id } });
const setLocalId = (locId, id) => ({ type: types.SET_DEFAULT_LOC_ID, payload: { locId, id } });

export {
  loadSpatialData,
  loadAllBuildingData,
  loadAllLocalData,
  searchBilune,
  setBuildingId,
  showHideBuildingFloor,
  searchInBuilding,
  setLocalId,
};
