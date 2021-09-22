import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import { useEffect } from "react";
import "./App.css";
import { coordsStore } from "./store/store";
import { addCoords, fetchCoords } from "./firebaseConfig";
function App() {
  const path = [
    { lat: 52.522300516078666, lng: 13.388037335784121 },
    { lat: 52.541932316055984, lng: 13.447775494963809 },
    { lat: 52.50642157993388, lng: 13.459448468596621 },
    { lat: 52.48761015505172, lng: 13.39730705013959 },
  ];
  const coords = coordsStore.useState((s) => s.coords);
  const onLoad = (drawingManager) => {
    return;
  };

  const onPolygonComplete = (polygon) => {
    addCoords([polygon.getPath().getArray().toString()]);
    // console.log("POLYGON", polygon.getPath().getArray().toString());
  };

  const onRectangleComplete = (rectangle) => {
    console.log("REC", rectangle);
  };

  useEffect(() => {
    fetchCoords().then((data) => {
      console.log("DATAAAAAAA", data);
      coordsStore.update((s) => {
        s.coords = data;
      });

      return;
    });
  }, []);
  console.log("HI");
  console.log("COORDS FETCHED", coords);
  return (
    <div className='App'>
      <LoadScript
        id='script-loader'
        googleMapsApiKey='AIzaSyBgxJ-padRN_a3sczwqk7sB1NPkuObA2gk&libraries=drawing'
        language='en'
        region='us'
      >
        <GoogleMap
          mapContainerClassName='App-map'
          zoom={12}
          center={{ lat: 52.52549080781086, lng: 13.398118538856465 }}
          version='weekly'
          on
        >
          <DrawingManager
            onLoad={onLoad}
            onPolygonComplete={onPolygonComplete}
            onRectangleComplete={onRectangleComplete}
          />
          <Polygon path={path} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
