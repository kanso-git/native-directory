/* eslint-disable no-mixed-operators */
const originShift = (2 * Math.PI * 6378137) / 2.0;
const typeLocal = require('./localTypes.json');

const MAP_LATITUDE_DELTA = 0.001;
const MAP_LONGITUDE_DELTA = 0.001;

const getBuilidngId = bilune => (bilune.id !== null ? bilune.id : bilune.buildings[0].id);
const toWebMercatorY = (latitude) => {
  let lat = (latitude / originShift) * 180.0;
  lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
  return lat;
};

// below formula to project a point to a coordinate
const toWebMercatorX = longitude => (longitude / originShift) * 180.0;
const colorByLocType = (id) => {
  const locObj = typeLocal.filter(l => l.id === id);
  return locObj.length > 0 ? locObj[0].color : '#f7f7f7';
};
const designationByLocType = (id) => {
  const locObj = typeLocal.filter(l => l.id === id);
  return locObj.length > 0 ? locObj[0].designation : '#f7f7f7';
};

const getBoundingBox = region => ([
  region.longitude - region.longitudeDelta / 2, // westLng - min lng
  region.latitude - region.latitudeDelta / 2, // southLat - min lat
  region.longitude + region.longitudeDelta / 2, // eastLng - max lng
  region.latitude + region.latitudeDelta / 2, // northLat - max lat
]);

const getBoundingBoxBl = region => ({
  long: region.longitude - region.longitudeDelta / 2, // westLng - min lng
  lat: region.latitude - region.latitudeDelta / 2, // southLat - min lat
});

const getBoundingBoxTr = region => ({
  long: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
  lat: region.latitude + region.latitudeDelta / 2, // northLat - max lat
});

const newLocal = true;
const localInBoundingBox = (region, local) => {
  // in case longitude 180 is inside the box
  const bl = getBoundingBoxBl(region);
  const tr = getBoundingBoxTr(region);

  const localExistInBound = local.geometry
    .rings[0].find((p) => {
      let isLongInRange;
      const pLong = toWebMercatorX(p[0]);
      const pLat = toWebMercatorY(p[1]);
      if (tr.long < bl.long) {
        isLongInRange = pLong >= bl.long || pLong <= tr.long;
      } else {
        isLongInRange = pLong >= bl.long && pLong <= tr.long;
      }
      const res = pLat >= bl.lat && pLat <= tr.lat && isLongInRange;
      if (res === true) {
        return true;
      }
      return false;
    });
  return localExistInBound ? newLocal : false;
};

const buildingInBoundingBox = (region, building) => {
  // in case longitude 180 is inside the box
  const bl = getBoundingBoxBl(region);
  const tr = getBoundingBoxTr(region);

  let isLongInRange;
  const pLong = toWebMercatorX(building.enteries[0].x);
  const pLat = toWebMercatorY(building.enteries[0].y);

  if (tr.long < bl.long) {
    isLongInRange = pLong >= bl.long || pLong <= tr.long;
  } else {
    isLongInRange = pLong >= bl.long && pLong <= tr.long;
  }
  return pLat >= bl.lat && pLat <= tr.lat && isLongInRange;
};

const filterLocals = (locals, etgId, batId) =>
  locals.filter(l => (l.attributes.BAT_ID === batId
    && (parseInt(l.attributes.ETG_ID, 10) === etgId || etgId === null)));

const polygonCenter = (rings) => {
  const x = rings.map(c => toWebMercatorY(c[1]));
  const y = rings.map(c => toWebMercatorX(c[0]));

  const minX = Math.min.apply(null, x);
  const maxX = Math.max.apply(null, x);

  const minY = Math.min.apply(null, y);
  const maxY = Math.max.apply(null, y);

  return {
    latitude: (minX + maxX) / 2,
    longitude: (minY + maxY) / 2,
  };
};

const floorCenter = (coordinates) => {
  const x = coordinates.map(c => c.latitude);
  const y = coordinates.map(c => c.longitude);

  const minX = Math.min.apply(null, x);
  const maxX = Math.max.apply(null, x);

  const minY = Math.min.apply(null, y);
  const maxY = Math.max.apply(null, y);

  return {
    latitude: (minX + maxX) / 2,
    longitude: (minY + maxY) / 2,
  };
};

const getMarkersForSelectedBat = (locals) => {
  const markersForSelectedBat = locals
    .map(f => polygonCenter(f.geometry.rings[0]));
  return markersForSelectedBat;
};


const getRegionForVisibleFloorsInTheSelectedBuilding = (bilune) => {
  const { localId, locals } = bilune;
  const id = getBuilidngId(bilune);
  const mainLocals = [];

  let buildingForlocalId = null;
  if (localId != null) {
    buildingForlocalId = id;
  }

  const mainBuilding = bilune.buildings.find(b => b.id === id);


  if (buildingForlocalId && mainBuilding.id === buildingForlocalId) {
    const local = locals.find(l => l.attributes.LOC_ID === localId);
    const etageId = parseInt(local.attributes.ETG_ID, 10);
    const tempLocals = filterLocals(locals, etageId, buildingForlocalId);
    mainLocals.push(...tempLocals);
  } else {
    const etageId = mainBuilding.etageIdParDefaut;
    const tempLocals = filterLocals(locals, etageId, mainBuilding.id);
    mainLocals.push(...tempLocals);
  }
  const coordinates = floorCenter(getMarkersForSelectedBat(mainLocals));
  const region = {
    latitude: coordinates.latitude,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitude: coordinates.longitude,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  };
  return region;
};

const getRegionForSelectedBat = (bilune) => {
  if (bilune.biluneState === 'BDL_LOADED') {
    return getRegionForVisibleFloorsInTheSelectedBuilding(bilune);
  }
  const id = getBuilidngId(bilune);
  const selectedBat = bilune.buildings.find(b => b.id === id);
  const region = {
    latitude: toWebMercatorY(selectedBat.enteries[0].y),
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitude: toWebMercatorX(selectedBat.enteries[0].x),
    longitudeDelta: MAP_LONGITUDE_DELTA,
  };
  return region;
};

const getRegionForSelectedBatInHomePage = (bilune) => {
  const id = getBuilidngId(bilune);
  const selectedBat = bilune.buildings.find(b => b.id === id);
  const region = {
    latitude: toWebMercatorY(selectedBat.enteries[0].y),
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitude: toWebMercatorX(selectedBat.enteries[0].x),
    longitudeDelta: MAP_LONGITUDE_DELTA,
  };
  return region;
};
const getCenteredRegionByFloor = (locals) => {
  const coordinates = floorCenter(getMarkersForSelectedBat(locals));
  const region = {
    latitude: coordinates.latitude,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitude: coordinates.longitude,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  };
  return region;
};

const getVisibleLocals = (bilune, region) => {
  const { localId, locals, floorId } = bilune;
  const id = getBuilidngId(bilune);
  const visibleLocals = {
    mainLocals: [],
    otherLocals: [],
  };

  let buildingForlocalId = null;
  if (localId != null) {
    buildingForlocalId = id;
  }

  const mainBuilding = bilune.buildings.find(b => b.id === id);
  const otherBuildinsgs = bilune.buildings.filter(b => b.id !== id);

  otherBuildinsgs.forEach((b) => {
    const etageId = b.etageIdParDefaut;
    const tempLocals = filterLocals(locals, etageId, b.id)
      .filter(l => localInBoundingBox(region, l));
    visibleLocals.otherLocals.push(...tempLocals);
  });

  if (buildingForlocalId && mainBuilding.id === buildingForlocalId) {
    const local = locals.find(l => l.attributes.LOC_ID === localId);
    const etageId = parseInt(local.attributes.ETG_ID, 10);
    const tempLocals = filterLocals(locals, etageId, buildingForlocalId)
      .filter(l => localInBoundingBox(region, l));
    visibleLocals.mainLocals.push(...tempLocals);
  } else {
    const etageId = floorId != null ? parseInt(floorId, 10) : mainBuilding.etageIdParDefaut;
    const tempLocals = filterLocals(locals, etageId, mainBuilding.id)
      .filter(l => localInBoundingBox(region, l));
    visibleLocals.mainLocals.push(...tempLocals);
  }

  return visibleLocals;
};

const getZoomLevel = (region) => {
  const angle = region.longitudeDelta;
  const level = Math.round(Math.log(360 / angle) / Math.LN2);
  return level;
};

const formatNomEtPrenom = (nom, prenom) => {
  let formatedPernom = '';
  const hasSpace = prenom.includes(' ');
  const hasDash = prenom.includes('-');

  if (hasSpace || hasDash) {
    if (hasSpace) {
      const withSpace = prenom.split(' ');
      withSpace.forEach((p) => {
        const hasSubDash = p.includes('-');
        if (hasSubDash) {
          const withSubDash = p.split('-');
          formatedPernom += `${withSubDash[0].slice(0, 1)}. - ${withSubDash[1].slice(0, 1)}. `;
        } else {
          formatedPernom += `${p.slice(0, 1)}. `;
        }
      });
    } else {
      const withSubDash = prenom.split('-');
      formatedPernom += `${withSubDash[0].slice(0, 1)}. - ${withSubDash[1].slice(0, 1)}. `;
    }
  } else {
    // no space no dash
    formatedPernom = `${prenom.slice(0, 1)}.`;
  }
  return `${nom} ${formatedPernom}`;
};

const extractParams = (params, bilune) => {
  const {
    buildingId, localId, buildingCode, localCode,
  } = params;

  let myBuilding = null;
  let myBuildingId = null;
  let myLocal = null;
  let myLocalId = null;
  let myFloorId = null;


  console.log(`buildingId:${buildingId}, 
       localId:${localId}, 
       localCode:${localCode},
       buildingCode:${buildingCode} `);

  if (buildingCode && buildingCode != null) {
    myBuilding = bilune.buildings.find(b => b.code === buildingCode);
    myBuildingId = myBuilding.id;
  }
  if (localCode && localCode != null) {
    myLocal = bilune.locals.find(l => l.attributes.LOC_CODE === localCode &&
      l.attributes.BAT_ID === myBuildingId);
    myLocalId = myLocal.attributes.LOC_ID;
    myFloorId = myLocal.attributes.ETG_ID;
  }
  if (buildingId && buildingId != null) {
    myBuildingId = buildingId;
  }
  if (localId && localId != null) {
    myLocal = bilune.locals.find(l => l.attributes.LOC_ID === localId);
    myLocalId = localId;
    myFloorId = myLocal.attributes.ETG_ID;
  }
  if (myBuildingId == null) {
    myBuildingId = bilune.buildings[0].id;
  }
  console.log(`extractParams id:${myBuildingId}, localId:${myLocalId}, myFloorId:${myFloorId}`);
  return {
    id: myBuildingId,
    localId: myLocalId,
  };
};

export {
  toWebMercatorY,
  toWebMercatorX,
  colorByLocType,
  getVisibleLocals,
  getRegionForSelectedBat,
  getMarkersForSelectedBat,
  getCenteredRegionByFloor,
  polygonCenter,
  getZoomLevel,
  getBoundingBox,
  buildingInBoundingBox,
  formatNomEtPrenom,
  getRegionForSelectedBatInHomePage,
  getBuilidngId,
  extractParams,
  designationByLocType,
};
