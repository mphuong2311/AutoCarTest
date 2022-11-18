export const ATTRIBUTION =
  '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors';

export const GPS_DEFAULT = [20.962179055697607, 105.74755553303486];
export const CENTER_MAP = [20.962179055697607, 105.74755553303486];
export const URL_MAP =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const BOUND_DEFAULT = [
  [20.9664, 105.7539],
  [20.9553, 105.7407],
];

export const BOUND_OPTION = { color: "green", weight: 1, fillOpacity: 0 };

export const ZOOM = 18;
export const MAP_OPTION = {
  zoomSnap: 0.5,
  zoomControl: false,
  minZoom: 12,
  maxZoom: 18,
};

export const MAP_OPTION_NOT_DRAGGING = {
  zoomSnap: 0.5,
  zoomControl: false,
  minZoom: 16,
  maxZoom: 18,
  dragging: false
};
