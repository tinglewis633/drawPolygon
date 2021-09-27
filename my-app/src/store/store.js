import { Store } from "pullstate";
export const coordsStore = new Store({
  polygonCoords: [],
  circleCoords: [],
  rectangleCoords: [],
});

export const appStore = new Store({
  addressPass: true,
  searched: false,
  markerCoord: {},
  address: "5128 Philp Rd, Beamsville, ON L0R 1B2",
  drawToggle: false,
  cuurentCircleID: "",
  cuurentRectangleID: "",
  cuurentPolygonID: "",
});

export const shapeFormStore = new Store({
  shapeForm: {
    name: "",
    description: "",
  },
});
