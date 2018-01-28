import axios from 'axios';
import { BDL_SECURITY_TOKEN, BDL_SECURITY_TOKEN_VAL, LOCAL, BUILDING,
  BDL_LOADED, BDL_LOADING, BDL_ERROR } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';

// filters
const filterGeometryForBuilding = (enteries, bId) => enteries
  .filter(e => e.attributes.BAT_ID === bId)
  .map(f => f.geometry);


const createGroupedArray = (arr, chunkSize) => {
  const groups = [];
  let i;
  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }
  return groups;
};

const getBiluneLocalsOneByOneAxios = async (bdlBuildingsData) => {
  try {
    const totalLocals = [];
    bdlBuildingsData.sort((a, b) => {
      if (a.id !== b.id) {
        return a.id - b.id;
      }
      if (a.id === b.id) {
        return 0;
      }
      return a.id > b.id ? 1 : -1;
    });
    for (const b of bdlBuildingsData) {
      const locals = await getBiluneLocalsForBuilding(b.id);
      totalLocals.push(...locals.data.features);
    }
    return totalLocals;
  } catch (e) {
    console.log(e);
  }
};
const getBiluneLocalsForBuilding = async (id) => {
  try {
    const res0 = await axios.get(queries.localsByBuildingId(id));
    return res0;
  } catch (e) {
    console.error(e);
  }
};
const getBiluneLocalsAxios = async (bdlBuildingsData) => {
  try {
    bdlBuildingsData.sort((a, b) => {
      if (a.id !== b.id) {
        return a.id - b.id;
      }
      if (a.id === b.id) {
        return 0;
      }
      return a.id > b.id ? 1 : -1;
    });
    const index = Math.ceil(bdlBuildingsData.length / 2);
    const groupedArr = bdlBuildingsData ? createGroupedArray(bdlBuildingsData, index) : [];

    const midElem = `${groupedArr[0].slice(-1)[0].id}`;

    const query0 = `BAT_ID < ${midElem + 1}`;
    const query1 = `BAT_ID > ${midElem}`;

    const res0 = await axios.get(queries.locals(query0));
    const res1 = await axios.get(queries.locals(query1));

    // result: "[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14]]"
    const finalResult = [...res0.data.features, ...res1.data.features];
    console.log(finalResult);
    return finalResult;
  } catch (e) {
    throw e;
  }
};

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

const getBiluneBuildingListAxios = async () => {
  let res;
  try {
    res = await axios.get(queries.buildings());
    return res.data ? res.data.features : res.data;
  } catch (e) {
    throw e;
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

const getBuildingList = () =>

  async (dispatch) => {
    dispatch({
      type: types.CHANGE_BILUNE_STATE,
      payload: {
        state: BDL_LOADING,
      },
    });

    try {
      const bdlBuildings = await getBdlBuildingListAxios();
      const locals = await getBiluneLocalsOneByOneAxios(bdlBuildings);
      const biluneBuildings = await getBiluneBuildingListAxios();
      const buildingsEnteries = await getBiluneBuildingEnteriesAxios();

      const buildings = bdlBuildings.map((b) => {
        const enteries = filterGeometryForBuilding(buildingsEnteries, b.id);
        const geometry = filterGeometryForBuilding(biluneBuildings, b.id);
        return { ...b, enteries, geometry };
      });


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

// todo make sure data are fully loaded before searching these data
const searchBilune = (query, data) => {
  const search = {};
  let buildings = [];
  let locals = [];

  if (data.state === BDL_LOADED && query && query.trim().length > 1) {
    //  search bilune building minimum query length is 3
    if (query.trim().length > 2) {
      buildings = data.buildings.filter((b) => {
        const abreviation = b.abreviation.toLowerCase();
        const adresseLigne1 = b.adresseLigne1.toLowerCase();
        const q = query.toLowerCase();
        return abreviation.includes(q) || adresseLigne1.includes(q);
      });
    }
    // as we can find local with length 2
    console.log(data.buildings);
    locals = data.locals.filter((b) => {
      const locCode = b.attributes.LOC_CODE.toLowerCase();
      const q = query.toLowerCase();
      console.log(`------ bat_id:${b.attributes.BAT_ID} locCode:${locCode} && query:${q}`);
      return locCode.includes(q);
    });

    search[LOCAL] = locals;
    search[BUILDING] = buildings;

    console.log(search);
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
  getBuildingList,
  searchBilune,
};
