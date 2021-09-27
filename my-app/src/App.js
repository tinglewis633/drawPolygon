// importing components for react-google-map
import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { useEffect } from "react";
import "./App.css";
import { coordsStore, appStore } from "./store/store";
// importing firestore functions
import {
  addPolygonCoords,
  fetchPolygonCoords,
  addCircleCoords,
  fetchCircleCoords,
  addRectangleCoords,
  fetchRectangleCoords,
} from "./firebaseConfig";
import ShapeInfoList from "./ShapeInfoList";
import SearchBar from "./SearchBar";
function App() {
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  const markerCoord = appStore.useState((s) => s.markerCoord);
  const drawToggle = appStore.useState((s) => s.drawToggle);
  const currentCircleID = appStore.useState((s) => s.currentCircleID);
  const currentRectangleID = appStore.useState((s) => s.currentRectangleID);
  const currentPolygonID = appStore.useState((s) => s.currentPolygonID);
  //direct to form if any shape is completed
  if (currentCircleID !== undefined) {
    window.location.href = `/shape-info-form/Circle/${currentCircleID}`;
  } else if (currentRectangleID !== undefined) {
    window.location.href = `/shape-info-form/Rectangle/${currentRectangleID}`;
  } else if (currentPolygonID !== undefined) {
    window.location.href = `/shape-info-form/Polygon/${currentPolygonID}`;
  }
  const onLoad = (drawingManager) => {
    return;
  };

  const onPolygonComplete = (polygon) => {
    addPolygonCoords([polygon.getPath().getArray().toString()]).then((data) => {
      console.log("DATA", data);
      appStore.update((s) => {
        s.currentPolygonID = data;
      });
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
  };

  const onRectangleComplete = (rectangle) => {
    let rectangleCoords = [
      { lat: rectangle.bounds.tc.g, lng: rectangle.bounds.Hb.g },
      { lat: rectangle.bounds.tc.g, lng: rectangle.bounds.Hb.i },
      { lat: rectangle.bounds.tc.i, lng: rectangle.bounds.Hb.i },
      { lat: rectangle.bounds.tc.i, lng: rectangle.bounds.Hb.g },
    ];

    addRectangleCoords(rectangleCoords).then((data) => {
      console.log("DATA", data);
      appStore.update((s) => {
        s.currentRectangleID = data;
      });
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
  };

  const onCircleComplete = (circle) => {
    let circleCoords = {
      lat: circle.center.lat(),
      lng: circle.center.lng(),
    };
    addCircleCoords(circleCoords, circle.radius).then((data) => {
      console.log("DATA", data);
      appStore.update((s) => {
        s.currentCircleID = data;
      });
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
  };

  const drawNewShape = () => {
    appStore.update((s) => {
      s.drawToggle = true;
    });
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
          final1Data.push({
            coords: finalData,
            id: coord.id,
            info: coord.info,
          });
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

    // fetch RectangleCoords
    fetchRectangleCoords().then((data) => {
      coordsStore.update((s) => {
        s.rectangleCoords = data;
      });
    });
  }, []);
  console.log("MARKER", markerCoord);
  if (
    //if no shapes in firestore
    polygonCoords.length === 0 &&
    circleCoords.length === 0 &&
    rectangleCoords.length === 0
  ) {
    return (
      <div className='App'>
        <LoadScript
          id='script-loader'
          googleMapsApiKey='AIzaSyBgxJ-padRN_a3sczwqk7sB1NPkuObA2gk&libraries=drawing,places'
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
  }
  // else if (currentCircleID || currentPolygonID || currentRectangleID) {
  //   <div>HI</div>;
  // }
  else {
    return (
      <div className='main'>
        <div className='App'>
          <LoadScript
            id='script-loader'
            googleMapsApiKey='AIzaSyBgxJ-padRN_a3sczwqk7sB1NPkuObA2gk&libraries=drawing,places'
            language='en'
            region='us'
          >
            <SearchBar />
            <button onClick={drawNewShape}>Create New Restriction Area</button>
            <br />
            <GoogleMap
              mapContainerClassName='App-map'
              zoom={12}
              center={{ lat: 43.144794456372686, lng: -79.49327825652 }}
              version='weekly'
              on
            >
              {drawToggle && (
                <DrawingManager
                  onLoad={onLoad}
                  onPolygonComplete={onPolygonComplete}
                  onRectangleComplete={onRectangleComplete}
                  onCircleComplete={onCircleComplete}
                />
              )}
              <Marker
                position={{
                  lng: -79.42081147683076,
                  lat: 43.137827,
                }}
              />
              {markerCoord.lat && <Marker position={markerCoord} />}
              {/*For each circle coord output a circle  */}
              {circleCoords.map((coord) => (
                <Circle
                  center={coord.coords}
                  radius={coord.radius}
                  key={coord.id}
                />
              ))}
              {/*For each polygon coord output a polygon  */}
              {polygonCoords.map((coord) => {
                return <Polygon path={coord.coords} key={coord.id} />;
              })}
              {/*For each rectangle coord output a rectangle  */}
              {rectangleCoords.map((coord) => {
                return <Polygon path={coord.coords} key={coord.id} />;
              })}
            </GoogleMap>
          </LoadScript>
        </div>

        <ShapeInfoList />
      </div>
    );
  }
}

export default App;
