import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
  circle,
  Circle,
} from "@react-google-maps/api";
import { useEffect } from "react";
import "./App.css";
import { coordsStore } from "./store/store";
import {
  addPolygonCoords,
  fetchPolygonCoords,
  addCircleCoords,
  fetchCircleCoords,
} from "./firebaseConfig";
function App() {
  const path = [
    { lat: 52.522300516078666, lng: 13.388037335784121 },
    { lat: 52.541932316055984, lng: 13.447775494963809 },
    { lat: 52.50642157993388, lng: 13.459448468596621 },
    { lat: 52.48761015505172, lng: 13.39730705013959 },
  ];
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const onLoad = (drawingManager) => {
    return;
  };

  const onPolygonComplete = (polygon) => {
    addPolygonCoords([polygon.getPath().getArray().toString()]);
  };

  const onRectangleComplete = (rectangle) => {
    console.log("REC", rectangle);
  };

  const onCircleComplete = (circle) => {
    let circleCoords = {
      lat: circle.center.lat(),
      lng: circle.center.lng(),
    };
    addCircleCoords(circleCoords, circle.radius);
  };

  useEffect(() => {
    //fetch PolygonCoords
    fetchPolygonCoords().then((data) => {
      // after fetching data from firestore, transform it into the correct form so that the polygon component can use
      let final1Data = [];
      if (data.length > 0) {
        data.forEach((coord) => {
          let finalData = [];
          let transformedData = null;

          transformedData = coord.coords
            .toString()
            .replace(/[{()}]/g, "")
            .replace(/ /g, "")
            .split(",")
            .map((coord) => parseFloat(coord));
          for (let i = 0; i < transformedData.length; i = i + 2) {
            finalData.push({
              lng: transformedData[i + 1],
              lat: transformedData[i],
            });
          }
          final1Data.push(finalData);
        });

        coordsStore.update((s) => {
          s.polygonCoords = final1Data;
        });
      }
      return;
    });

    // fetch CircleCoords
    fetchCircleCoords().then((data) => {
      coordsStore.update((s) => {
        s.circleCoords = data;
      });
    });
  }, []);
  console.log("I AM CIRCLE", circleCoords);
  console.log("I AM POLYGON", polygonCoords);
  if (polygonCoords.length === 0 && circleCoords.length === 0) {
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
            center={{ lat: 40.144794456372686, lng: -75.41317825652716 }}
            version='weekly'
            on
          >
            <DrawingManager
              onLoad={onLoad}
              onPolygonComplete={onPolygonComplete}
              onRectangleComplete={onRectangleComplete}
              onCircleComplete={onCircleComplete}
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
            zoom={13}
            center={{ lat: 43.144794456372686, lng: -79.49327825652 }}
            version='weekly'
            on
          >
            <DrawingManager
              onLoad={onLoad}
              onPolygonComplete={onPolygonComplete}
              onRectangleComplete={onRectangleComplete}
              onCircleComplete={onCircleComplete}
            />
            <Circle
              center={{ lat: 43.18063928920623, lng: -79.47475442862635 }}
              radius={1763.9035453745257}
            />
            {circleCoords.map((coord) => (
              <Circle
                center={coord.coords}
                radius={coord.radius}
                key={coord.id}
              />
            ))}
            {polygonCoords.map((coord) => (
              <Polygon path={coord} key={coord.id} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default App;
