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
      let final1Data = [];
      if (data.length > 0) {
        data.forEach((coord) => {
          let finalData = [];
          let transformedData = null;
          {
            transformedData = coord.coords
              .toString()
              .replace(/[{()}]/g, "")
              .replace(/ /g, "")
              .split(",")
              .map((coord) => parseFloat(coord));
            console.log("TRANS", transformedData);
            for (let i = 0; i < transformedData.length; i = i + 2) {
              finalData.push({
                lng: transformedData[i + 1],
                lat: transformedData[i],
              });
            }
            console.log("FINALLLLDATA", finalData);
            final1Data.push(finalData);
          }
        });

        coordsStore.update((s) => {
          s.coords = final1Data;
        });
      }
      return;
    });
  }, []);

  console.log("COORDSSSS", coords);
  if (coords.length === 0) {
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
          </GoogleMap>
        </LoadScript>
      </div>
    );
  } else {
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
            {coords.map((coord) => (
              <Polygon path={coord} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default App;
