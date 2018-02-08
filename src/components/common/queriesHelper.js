import { API_BILUNE, API_BDL } from 'react-native-dotenv';

const buildingPrefix = `${API_BILUNE}/0/query?`;
const localPrefix = `${API_BILUNE}/2/query?`;
const accessPrefix = `${API_BILUNE}/1/query?`;

const commonPart = () => {
  let url = '&geometryType=esriGeometryEnvelope';
  url += '&spatialRel=esriSpatialRelIntersects';
  url += '&outFields=*';
  url += '&returnGeometry=true';
  url += '&returnTrueCurves=false';
  url += '&returnIdsOnly=false';
  url += '&returnCountOnly=false';
  url += '&returnZ=false';
  url += '&returnM=false';
  url += '&returnDistinctValues=false';
  url += '&f=pjson';
  return url;
};

const bdlBuildings = () => `${API_BDL}/batiments`;

const bdlBuildingFloors = myBatId => `${API_BDL}/batiments/${myBatId}/etages`;

const buildings = () => {
  const url = 'where=BAT_ID > 0';
  return buildingPrefix + url + commonPart();
};

const buildingsEnteries = () => {
  const url = 'where=BAT_ID > 0';
  return accessPrefix + url + commonPart();
};

const buildingById = (id) => {
  const url = `where=BAT_ID=${id}`;
  return buildingPrefix + url + commonPart();
};

const localsByBuildingId = (id) => {
  const url = `where=BAT_ID=${id}`;
  return localPrefix + url + commonPart();
};

const locals = (query) => {
  const url = `where=${query}`;
  return localPrefix + url + commonPart();
};

const localsByBuildingIdAndFloorId = (bId, fId) => {
  const url = `where=BAT_ID=${bId}&ETG_ID=${fId}`;
  return localPrefix + url + commonPart();
};

export {
  buildings,
  buildingById,
  locals,
  localsByBuildingId,
  localsByBuildingIdAndFloorId,
  bdlBuildings,
  bdlBuildingFloors,
  buildingsEnteries };

/*

/batiments
Liste des b‚timents

/batiments/<batimentId>/etages
Liste des Ètages d'un b‚timent

/batiments/{batimentId}/etages/{etageId}/locaux
Liste des locaux d'un Ètage d'un b‚timent

/batiments/{batimentId}/locaux
Liste des locaux d'un b‚timent

/batiments/<batimentId>/personnes
Liste des personnes d'un b‚timent

/batiments/{batimentId}/etages/{etageId}/personnes
Liste des personnes d'un Ètage, d'un batiment

https://biluneweb.unine.ch/locaux/3056/personnes
Liste des personnes d'un bureau;

/batiments/{batimentId}/photo/normal
ou
/batiments/{batimentId}/photo
Photo standard du b‚timent

/batiments/{batimentId}/photo/mini
Photo miniature du b‚timent

https://biluneapi.unine.ch/locaux/549/photo/mini.jpg
Photo miniature du local

https://biluneapi.unine.ch/locaux/549/photo.jpg
big photo

/locaux
https://biluneapi.unine.ch/locaux
list de locaux
*/
