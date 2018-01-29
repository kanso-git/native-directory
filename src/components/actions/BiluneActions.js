/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */

import axios from 'axios';
import { BDL_SECURITY_TOKEN, BDL_SECURITY_TOKEN_VAL, LOCAL, BUILDING,
  BDL_LOADED, BDL_LOADING, BDL_ERROR } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';

// filters
const filterGeometryForBuilding = (enteries, bId) => enteries
  .filter(e => e.attributes.BAT_ID === bId)
  .map(f => f.geometry);

const filterBuildingById = (blArr, id) => blArr.filter(b => b.id === id)[0];
const getBdlBuildingListAxios = async () => {
  let res;
  const headers = {};
  headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;
  try {
    res = await axios.get(queries.bdlBuildings(), { headers });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getBiluneLocalsWithSpatialDataAxios = async () => {
  try {
    const locals = await axios.get(queries.locals('BAT_ID>0'));
    console.info(`found ${locals.data.features.length} locals`);
    return locals.data.features;
  } catch (e) {
    console.error(e);
  }
};

const getBiluneBuildingEnteriesAxios = async () => {
  let res;
  const headers = {};
  headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;
  try {
    res = await axios.get(queries.buildingsEnteries());
    return res.data ? res.data.features : res.data;
  } catch (e) {
    throw e;
  }
};

const loadSpatialData = () =>

  async (dispatch) => {
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
        type: types.GET_BUILDING_LIST,
        payload: {
          buildings,
          locals: [],
        },
      });
      // const locals = await getBiluneLocalsOneByOneAxios(bdlBuildings);
      const locals = await getBiluneLocalsWithSpatialDataAxios();

      dispatch({
        type: types.GET_BUILDING_LIST,
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

const searchBilune = (query, data) => {
  const search = {};
  let buildings = [];
  let locals = [];

  if (query && query.trim().length > 1) {
    // search bilune building minimum query length is 3
    if (query.trim().length > 2) {
      buildings = data.buildings.filter((b) => {
        const abreviation = b.abreviation.toLowerCase();
        const adresseLigne1 = b.adresseLigne1.toLowerCase();
        const q = query.toLowerCase();
        return abreviation.includes(q) || adresseLigne1.includes(q);
      });
    }
    // as we can find local with length 2
    if (data.state === BDL_LOADED) {
      locals = data.locals.filter((b) => {
        const locCode = b.attributes.LOC_CODE.toLowerCase();
        const typeDes = b.attributes.LOC_TYPE_DESIGNATION.toLowerCase();
        const q = query.toLowerCase();
        return locCode.includes(q) || typeDes.includes(q);
      });
    }
    search[LOCAL] = locals.map((l, index) => ({
      ...l,
      type: LOCAL,
      key: l.attributes.LOC_ID,
      building: filterBuildingById(data.buildings, l.attributes.BAT_ID),
      subIndex: index,
    }));
    search[BUILDING] = buildings.map((b, index) => ({
      ...b, type: BUILDING, key: b.id, subIndex: index,
    }));
    return {
      type: types.SET_SEARCH_BILUNE,
      payload: {
        search,
      },
    };
  }
  return {
    type: types.RESET_SEARCH_BILUNE,
    payload: search,
  };
};

export {
  loadSpatialData,
  searchBilune,
};
