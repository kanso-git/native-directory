/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint global-require: "off" */

import axios from 'axios';
import { BDL_SECURITY_TOKEN,
  BDL_SECURITY_TOKEN_VAL,
  API_BDL, LOCAL, BUILDING,
  BDL_LOADED,
  BDL_LOADING,
  BDL_ERROR } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';

const base64Image0 = 'data:image/png;base64,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';
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
      `data:${mimetype};base64,${base64Str}` : base64Image0;
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
    return res.data;
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
      console.info(`loading images for ${imagesId.length} buildings`);
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

const formatedDataForList = (myBuilding) => {
  // handle data formating
  const locals = [];
  let building = {};
  if (myBuilding && myBuilding.locals && myBuilding.floors) {
    myBuilding.floors.forEach((b) => {
      const localsPerFloor = myBuilding.locals.filter(l => parseInt(l.attributes.ETG_ID, 10) === b.id);
      locals.push(...localsPerFloor);
    });
    building = { ...myBuilding, locals };
  } else {
    building = { ...myBuilding };
  }
  return building;
};
const loadAllBuildingData = buildingId =>
  async (dispatch, getState) => {
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
              ((typeCode === 11 || typeCode === 12 || typeCode === 3))) {
          imagesId.push(loc.attributes.OBJECTID);
          imagesPromise.push(getImageUsingBlob(`${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
        }
      });
      console.info(`loading images for ${imagesId.length} locals`);
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
    const dataBuildings = getState().bilune.buildings;
    const buildings = [];
    try {
      const floors = await getBdlBuildingFloorsAxios(buildingId);

      dataBuildings.forEach((currBuilding) => {
        if (currBuilding.id === buildingId) {
          const buidlingFormated = formatedDataForList({ ...currBuilding, locals, floors });
          buildings.push(buidlingFormated);
        } else {
          buildings.push(currBuilding);
        }
      });

      dispatch({
        type: types.ENRICH_BILUNE_BUILDING,
        payload: { buildings },
      });
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          console.error(`Error buildingFloors ${e} `);
        }
      }
    }
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
        console.info(`loading images for ${imagesId.length} buildings`);
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
          if (typeCode === 11 || typeCode === 12 || typeCode === 3) {
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
            ((typeCode === 11 || typeCode === 12 || typeCode === 3))) {
            imagesId.push(loc.attributes.OBJECTID);
            imagesPromise.push(getImageUsingBlob(`${API_BDL}/locaux/${loc.attributes.LOC_ID}/photo/mini`));
          }
        });
        console.info(`loading images for ${imagesId.length} locals`);
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

const zoomToBat = ({ id }) => ({ type: types.SET_DEFAULT_BAT_ID, payload: { id } });
export {
  loadSpatialData,
  loadAllBuildingData,
  searchBilune,
  zoomToBat,
};
