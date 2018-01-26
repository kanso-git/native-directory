import axios from 'axios';
import { BDL_SECURITY_TOKEN, BDL_SECURITY_TOKEN_VAL } from 'react-native-dotenv';
import * as types from './Types';
import * as queries from '../common/queriesHelper';

// filters
const filterGeometryForBuilding = (enteries, bId) => enteries
  .filter(e => e.attributes.BAT_ID === bId)
  .map(f => f.geometry);


const getBiluneLocalsAxios = async () => {
  let res;
  const headers = {};
  headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;
  try {
    res = await axios.get(queries.locals(), { headers });
    return res.data ? res.data.features : res.data;
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
  const headers = {};
  headers[`${BDL_SECURITY_TOKEN}`] = BDL_SECURITY_TOKEN_VAL;
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
    try {
      const locals = await getBiluneLocalsAxios();
      const biluneBuildings = await getBiluneBuildingListAxios();
      const buildingsEnteries = await getBiluneBuildingEnteriesAxios();

      const bdlBuildings = await getBdlBuildingListAxios();

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
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          console.error(`Error getBuildingList ${e} `);
        }
      }
    }
  };


export {
  getBuildingList,
};
