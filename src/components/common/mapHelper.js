/* eslint-disable no-mixed-operators */
const originShift = (2 * Math.PI * 6378137) / 2.0;
const typeLocal = require('./localTypes.json');

const MAP_LATITUDE_DELTA = 0.0006;
const MAP_LONGITUDE_DELTA = 0.0006;

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

const filterLocals = (locals, etgId, batId) =>
  locals.filter(l => (l.attributes.BAT_ID === batId
    && (parseInt(l.attributes.ETG_ID, 10) === etgId || etgId === null)));

const getRegionForSelectedBat = (bilune) => {
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

const getVisibleLocals = (bilune) => {
  const { localId, locals } = bilune;
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
    const tempLocals = filterLocals(locals, etageId, b.id);
    visibleLocals.otherLocals.push(...tempLocals);
  });

  if (buildingForlocalId && mainBuilding.id === buildingForlocalId) {
    const local = locals.find(l => l.attributes.LOC_ID === localId);
    const etageId = parseInt(local.attributes.ETG_ID, 10);
    const tempLocals = filterLocals(locals, etageId, buildingForlocalId);
    visibleLocals.mainLocals.push(...tempLocals);
  } else {
    const etageId = mainBuilding.etageIdParDefaut;
    const tempLocals = filterLocals(locals, etageId, mainBuilding.id);
    visibleLocals.mainLocals.push(...tempLocals);
  }

  return visibleLocals;
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

};
