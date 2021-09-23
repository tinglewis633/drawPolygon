import { Store } from "pullstate";
export const coordsStore = new Store({
  polygonCoords: [],
  circleCoords: [],
  rectangleCoords: [],
});

export const appStore = new Store({
  search: "",
  addressPass: true,
  searched: false,
});
