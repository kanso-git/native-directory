/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint global-require: "off" */
/* eslint-disable consistent-return */

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
import * as utile from '../common/utile';
import * as logging from '../common/logging';

const headers = {};
headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;

// filters
const filterGeometryForBuilding = (enteries, bId) => enteries
  .filter(e => e.attributes.BAT_ID === bId)
  .map(f => f.geometry);

const filterBuildingById = (blArr, id) => blArr.filter(b => b.id === id)[0];

const getImageUsingBlob = async (dispatch, url) => {
  try {
    const RNFetchBlob = require('react-native-fetch-blob').default;
    const res = await RNFetchBlob.fetch('GET', url, {
      ...headers,
    });
    const mimetype = 'image/jpg';
    const base64Str = res.base64();
    return (res.base64() && res.base64().length > 0) ?
      `data:${mimetype};base64,${base64Str}` : null;
  } catch (e) {
    logging.warn(`error occured getImageUsingBlob ${e}`);
    const isConnected = await utile.isConnected();
    const service = 'getImageUsingBlob';
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service,
        error: e,
      },
    });
  }
};

const getBdlBuildingListAxios = async (dispatch) => {
  let res;
  try {
    res = await axios.get(queries.bdlBuildings(), { headers });
    const sortedBuil = require('../common/buildingOrder.json');
    let finalResult = res.data;
    if (res.data && res.data.length > 0) {
      const dataWithSortFlag = res.data.map((b) => {
        const order = sortedBuil.find(s => s.code === b.code);
        let abrev = b.abreviation;
        let sliderOrder = -1;
        if (order) {
          sliderOrder = order.displayOrder;
          abrev = order.abreviation;
        }
        return { ...b, sliderOrder, abreviation: abrev };
      });
      finalResult = dataWithSortFlag.sort((a, b) => a.sliderOrder - b.sliderOrder);
    }
    return finalResult;
  } catch (e) {
    logging.warn(`error occured getBdlBuildingFloorsAxios ${e}`);
    const isConnected = await utile.isConnected();
    const service = 'getBdlBuildingListAxios';
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service,
        error: e,
      },
    });
  }
};

const getBdlBuildingFloorsAxios = async (dispatch, floorBuildingId) => {
  let res;
  try {
    res = await axios.get(queries.bdlBuildingFloors(floorBuildingId), { headers });
    // default collapsed value
    const collapsed = true;
    return res.data.map((f, index) => ({ ...f, collapsed, sortOrder: index + 1 }));
  } catch (e) {
    logging.warn(`error occured getBdlBuildingFloorsAxios ${e}`);
    const isConnected = await utile.isConnected();
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service: 'getBdlBuildingFloorsAxios',
        error: e,
      },
    });
  }
};
const filterLocalsForVisibleBuildings = (local, buildings) => {
  const localBuildingId = local.attributes.BAT_ID;
  const exist = buildings.find(b => b.id === localBuildingId);
  return exist;
};
const getBiluneLocalsWithSpatialDataAxios = async (dispatch, buildings) => {
  try {
    const locals = await axios.get(queries.locals('BAT_ID>0'));
    logging.info(`found ${locals.data.features.length} locals`);
    return locals.data.features.filter(l => filterLocalsForVisibleBuildings(l, buildings));
  } catch (e) {
    logging.warn(`error getBiluneLocalsWithSpatialDataAxios ${e}`);
    const isConnected = await utile.isConnected();
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service: 'getBiluneLocalsWithSpatialDataAxios',
        error: e,
      },
    });
  }
};

const getBiluneBuildingEnteriesAxios = async (dispatch) => {
  let res;
  try {
    res = await axios.get(queries.buildingsEnteries());
    return res.data ? res.data.features : res.data;
  } catch (e) {
    logging.warn(`error getBiluneBuildingEnteriesAxios ${e}`);
    const isConnected = await utile.isConnected();
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service: 'getBiluneBuildingEnteriesAxios',
        error: e,
      },
    });
  }
};


const getOccupentPerLocalAxios = async (dispatch, localId) => {
  let res;
  try {
    const url = queries.occupentsInLocal(localId);
    res = await axios.get(url, { headers });
    return res.data;
  } catch (e) {
    logging.warn(`error getOccupentPerLocalAxios ${e}`);
    const isConnected = await utile.isConnected();
    return dispatch({
      type: types.UPDATE_CONNECTION_STATE,
      payload: {
        isConnected,
        service: 'getOccupentPerLocalAxios',
        error: e,
      },
    });
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
      const bdlBuildings = await getBdlBuildingListAxios(dispatch);
      // const biluneBuildings = await getBiluneBuildingListAxios();
      const buildingsEnteries = await getBiluneBuildingEnteriesAxios(dispatch);

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
          imagesPromise.push(getImageUsingBlob(dispatch, `${API_BDL}/batiments/${b.id}/photo/mini`));
        }
      });
      logging.info(`loadSpatialData loading images for ${imagesId.length} buildings`);
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
        }).catch(err => logging.warn(`err loading image:${err}`));
      }
      // const locals = await getBiluneLocalsOneByOneAxios(bdlBuildings);
      const locals = await getBiluneLocalsWithSpatialDataAxios(dispatch, bdlBuildings);

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
      logging.info(`loadSpatialData loading time: ${time}`);
    } catch (e) {
      dispatch({
        type: types.CHANGE_BILUNE_STATE,
        payload: {
          state: BDL_ERROR,
        },
      });
      if (e.response) {
        if (e.response.status === 401) {
          logging.warn(`Error getBuildingList ${e} `);
        }
      }
    }
  };

const formatedBuildingDataForList = (myBuilding) => {
  // handle data formating
  const locals = [];
  let building = {};
  const totalLocalsLen = myBuilding.locals ? myBuilding.locals.length : 0;
  if (myBuilding && myBuilding.locals && myBuilding.floors) {
    myBuilding.floors.forEach((b) => {
      const localsPerFloor = myBuilding
        .locals.filter(l => parseInt(l.attributes.ETG_ID, 10) === b.id);


      const localsPerFloorWithSection = localsPerFloor.map((l, i) => {
        if (i === 0) {
          const section = l.attributes.ETG_DESIGNATION;
          return { ...l, section };
        }
        return l;
      });
      // remove the collaped locals keep only one for for the section
      if (localsPerFloorWithSection.length > 0) {
        if (b.collapsed) {
          locals.push(localsPerFloorWithSection[0]);
        } else {
          locals.push(...localsPerFloorWithSection);
        }
      }
    });

    building = {
      ...myBuilding,
      totalLocalsLen,
      locals: locals.map((item, index) => ({
        ...item, type: LOCAL, key: `local_key_${item.attributes.LOC_ID}`, index,
      })),
    };
  } else {
    building = { ...myBuilding, totalLocalsLen };
  }
  return building;
};
const reservationListAxios = async (lId, sD, eD) => {
  const url = queries.reservationsByLocalId(lId, sD, eD);
  logging.info(`url reservationListAxios ${url}`);
  const res = await axios.get(url);
  return res.data;
};
const sortByHeuredebutUTC = (o) => {
  const moment = utile.momentStatic;
  return moment(o.debutUTC, moment.ISO_8601).unix();
};
const formatedLocalReservationDataForList = (myLocal) => {
  const moment = utile.momentStatic;
  if (myLocal && myLocal.days) {
    const formattedDays = [];
    let num = 0;
    const missingDays = [];
    while (num < 6) {
      const date = moment().add(num, 'd').format('YYYY-MM-DD');
      const missingDayIndex = _.findIndex(myLocal.days, o => o.date === date);
      if (missingDayIndex === -1) {
        missingDays.push({
          date,
          occupation: {
            date,
            dateUnix: moment().add(num, 'd').unix(),
            typeoccupation: RESERVATION_EMPTY,
            debutUTC: moment().add(num, 'd').format(moment().ISO_8601),
            debutUTCUnix: moment().add(num, 'd').unix(),
          },
        });
      }
      num += 1;
    }
    const alldays = [...myLocal.days, ...missingDays];

    alldays.forEach((d) => {
      const section = d.date;
      if ((d.occupation && d.occupation.length > 0)) {
        const occupations = _.sortBy(d.occupation, [sortByHeuredebutUTC]);
        occupations.forEach((oc, i) => {
          const dateUnix = moment(oc.date, 'YYYY-MM-DD').unix();
          const debutUTCUnix = moment(oc.debutUTC, moment.ISO_8601).unix();
          if (i === 0) {
            formattedDays.push({
              ...oc, dateUnix, debutUTCUnix, section, collapsed: false,
            });
          } else {
            formattedDays.push({ ...oc, dateUnix, debutUTCUnix });
          }
        });
      } else if (_.isObject(d.occupation)) {
        const dateUnix = moment(d.occupation.date, 'YYYY-MM-DD').unix();
        const debutUTCUnix = moment(d.occupation.debutUTC, moment.ISO_8601).unix();
        formattedDays.push({
          ...d.occupation, dateUnix, debutUTCUnix, section, collapsed: false,
        });
      }
    });

    const formattedDaysSorted = _.sortBy(formattedDays, ['dateUnix']);

    return {
      ...myLocal,
      days: formattedDaysSorted.map((item, index) => ({
        ...item, type: RESERVATION, key: `day_key_${index}`, index,
      })),
    };
  }

  return myLocal;
};
const searchInProf = (prof, q) => {
  if (_.isArray(prof)) {
    const resLen = prof.filter(p => p.toLowerCase().includes(q)).length;
    return resLen > 0;
  }
  const profLowerCase = prof.toLowerCase();
  return profLowerCase.includes(q);
};
const searchInLocalReservations = (localId, searchQuery) =>
  (dispatch, getState) => {
    const { reservations, localWithReservations } = getState().bilune;
    const days = reservations[localId];
    const q = searchQuery.toLowerCase();

    const filterdDays = [];
    days.forEach((d) => {
      const resInDate = d.date.includes(q);

      let resInOccupation = false;
      let resFromOcc = null;
      if (d.occupation != null) {
        if (_.isArray(d.occupation)) {
          resFromOcc = d.occupation.filter((o) => {
            const { matiere, prof, remarque } = o;
            const remarqueSearch = remarque != null ? remarque.toLowerCase().includes(q) : false;
            return matiere.includes(q)
              || remarqueSearch || searchInProf(prof, q);
          });
          resInOccupation = resFromOcc && resFromOcc.length > 0;
        } else {
          const { matiere, prof, remarque } = d.occupation;
          const remarqueSearch = remarque != null ? remarque.toLowerCase().includes(q) : false;
          resInOccupation = matiere.includes(q) || remarqueSearch || searchInProf(prof, q);
          if (resInOccupation) {
            resFromOcc = d.occupation;
          }
        }
      }
      if (resInDate) {
        filterdDays.push(d);
      } else if (resInOccupation) {
        filterdDays.push({ ...d, occupation: resFromOcc });
      }
    });

    const newLocalWithReservations = formatedLocalReservationDataForList({
      ...localWithReservations, days: filterdDays, query: searchQuery,
    });

    dispatch({
      type: types.ENRICH_BILUNE_LOCAL_RESERVATIONS,
      payload: { localWithReservations: newLocalWithReservations },
    });
  };


const completeLoadingLocalData = (localId, dataReservations, dispatch, getState) => {
  const { reservations } = getState().bilune;
  const days = dataReservations.Query.Horaire.jour ? dataReservations.Query.Horaire.jour : [];
  reservations[localId] = days;
  const dataLocals = getState().bilune.locals;
  dataLocals.forEach((currLocal) => {
    if (parseInt(currLocal.attributes.LOC_ID, 10) === localId) {
      const { salleplaces } = dataReservations.Query.Horaire;
      const localWithReservations = formatedLocalReservationDataForList({
        ...currLocal, days, query: '', salleplaces,
      });

      dispatch({
        type: types.ENRICH_BILUNE_LOCAL_RESERVATIONS,
        payload: { localWithReservations, reservations },
      });
    }
  });
};
const showHideReservationDay = (localId, day) =>
  async (dispatch, getState) => {
    const myLocalWithReservations = getState().bilune.localWithReservations;
    const days = myLocalWithReservations.days.map((f) => {
      if (f.date === day) {
        const collapsed = !f.collapsed;
        return { ...f, collapsed };
      }
      return f;
    });
    const localWithReservations = { ...myLocalWithReservations, days };
    dispatch({
      type: types.ENRICH_BILUNE_LOCAL_RESERVATIONS,
      payload: { localWithReservations },
    });
  };
const loadAllLocalData = localId =>
  async (dispatch, getState) => {
    const moment = utile.momentStatic;
    const now = moment();
    const startDate = now.format('YYYY-MM-DD');
    const endDate = now.add(7, 'd').format('YYYY-MM-DD');
    const { reservations } = getState().bilune;

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
  };

const loadOccupentsPerLocal = localId =>
  async (dispatch, getState) => {
    try {
      const { occupents } = getState().bilune;
      if (occupents[localId]) {
        return occupents[localId];
      }
      const occupentsList = await getOccupentPerLocalAxios(dispatch, localId);
      occupents[localId] = occupentsList;
      dispatch({
        type: types.ENRICH_OCCUPENTS_PER_LOCAL,
        payload: { occupents },
      });
      return occupentsList;
    } catch (e) {
      logging.warn(`error in loadOccupentsPerLocal error:${e}`);
    }
  };

const loadBuildingFloors = buildingId =>
  async (dispatch, getState) => {
    try {
      const floors = await getBdlBuildingFloorsAxios(dispatch, buildingId);
      const dataBuildings = getState().bilune.buildings;
      const buildings = dataBuildings.map((b) => {
        if (b.id === buildingId) {
          return { ...b, floors };
        }
        return b;
      });

      dispatch({
        type: types.ENRICH_BILUNE_BUILDING,
        payload: { buildings },
      });
      return floors;
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          logging.warn(`Error buildingFloors ${e} `);
        }
      }
    }
  };


const loadAllBuildingData = buildingId =>
  async (dispatch, getState) => {
    try {
      const floors = await getBdlBuildingFloorsAxios(dispatch, buildingId);
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
            imagesPromise.push(getImageUsingBlob(dispatch, `${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
          }
        });
        logging.info(`loadAllBuildingData loading images for ${imagesId.length} locals`);
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
          }).catch(err => logging.warn(`err loading image:${err}`));
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
          logging.warn(`Error buildingFloors ${e} `);
        }
      }
    }
  };

const filterLocalsForBuilding = (dataLocals, buildingId, searchQuery) => {
  const buildingsLocals = dataLocals.filter((l) => {
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
  return locals;
};
const searchInBuilding = (buildingId, searchQuery) =>
  async (dispatch, getState) => {
    const dataBuildings = getState().bilune.buildings;
    const buildings = [];

    dataBuildings.forEach((currBuilding) => {
      if (currBuilding.id === buildingId) {
        // dataLocals, buildingId, searchQuery
        const dataLocals = getState().bilune.locals;
        const locals = filterLocalsForBuilding(dataLocals, buildingId, searchQuery);

        // expaned the floors after the search
        const expanded = searchQuery.length > 0 ?
          currBuilding.floors.map(f => ({ ...f, collapsed: false })) :
          currBuilding.floors.map(f => ({ ...f, collapsed: true }));

        const tobeFormatted = {
          ...currBuilding, floors: expanded, query: searchQuery, locals,
        };
        const formated = formatedBuildingDataForList(tobeFormatted);
        buildings.push(formated);
      } else {
        buildings.push(currBuilding);
      }
    });

    dispatch({
      type: types.ENRICH_BILUNE_BUILDING,
      payload: { buildings },
    });
  };

const expandCollapseBuildingFloor = (floorId, searchQuery) =>

  async (dispatch, getState) => {
    const dataBuildings = getState().bilune.buildings;
    const buildingId = getState().bilune.id;
    const buildings = [];

    dataBuildings.forEach((currBuilding) => {
      if (currBuilding.id === buildingId) {
        // dataLocals, buildingId, searchQuery
        const dataLocals = getState().bilune.locals;
        const locals = filterLocalsForBuilding(dataLocals, buildingId, searchQuery);

        // expaned the floors after the search
        const floors = currBuilding.floors.map((f) => {
          if (f.id === floorId) {
            const collapsed = !f.collapsed;
            return { ...f, collapsed };
          }
          return f;
        });
        const tobeFormatted = {
          ...currBuilding, floors, query: searchQuery, locals,
        };
        const formated = formatedBuildingDataForList(tobeFormatted);
        buildings.push(formated);
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
            imagesPromise.push(getImageUsingBlob(dispatch, `${API_BDL}/batiments/${b.id}/photo/mini`));
          }
        });
        logging.info(`searchBilune loading images for ${imagesId.length} buildings`);
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
          }).catch(err => logging.warn(`err loading image:${err}`));
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
            imagesPromise.push(getImageUsingBlob(dispatch, `${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
          }
        });
        logging.info(`searchBilune loading images for ${imagesId.length} locals`);
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
          }).catch(err => logging.warn(`err loading image:${err}`));
        }
      }

      if (query.length > 1 && locals.length > 0) {
        search[LOCAL] = locals.map((l, index) => ({
          ...l,
          type: LOCAL,
          key: `local_key_${l.attributes.LOC_ID}`,
          building: filterBuildingById(dataBuildings, l.attributes.BAT_ID),
          subIndex: index,

        }));
      } else {
        search[LOCAL] = [];
      }

      if (query.length > 2 && buildings.length > 0) {
        search[BUILDING] = buildings.map((b, index) => ({
          ...b, type: BUILDING, key: `building_key_${b.id}`, subIndex: index,
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
    logging.info(`don't search query is:${query}`);
    return dispatch({
      type: types.RESET_SEARCH_BILUNE,
      payload: {
        search,
      },
    });
  };

const loadLocalImageById = (localObjId, locId) =>
  async (dispatch, getState) => {
    // load building images for home slider
    const { images } = getState().bilune;
    // image is not loaded
    try {
      const imagesPromise = await getImageUsingBlob(dispatch, `${API_BDL}/locaux/${locId}/photo/mini`);
      logging.info(`loadLocalImageById  for LOCAL:${locId} `);
      images[localObjId] = imagesPromise;
      dispatch({
        type: types.SET_IMAGE_BILUNE,
        payload: { images },
      });
    } catch (err) { logging.warn(`err loading image:${err}`); }
  };
const setBuildingId = ({ id }) => ({ type: types.SET_DEFAULT_BAT_ID, payload: { id } });
const setLocalId = (locId, id) => ({ type: types.SET_DEFAULT_LOC_ID, payload: { locId, id } });

export {
  loadSpatialData,
  loadAllBuildingData,
  loadAllLocalData,
  searchBilune,
  setBuildingId,
  expandCollapseBuildingFloor,
  searchInBuilding,
  setLocalId,
  showHideReservationDay,
  searchInLocalReservations,
  loadOccupentsPerLocal,
  loadBuildingFloors,
  loadLocalImageById,
};
