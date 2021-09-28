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
import { coordsStore, appStore, shapeStore } from "./store/store";
// importing firestore functions
import {
  fetchPolygonCoords,
  fetchCircleCoords,
  fetchRectangleCoords,
} from "./firebaseConfig";
import ShapeInfoList from "./ShapeInfoList";
import ShapeInfoForm from "./ShapeInfoForm";
import SearchBar from "./SearchBar";
function App() {
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  const markerCoord = appStore.useState((s) => s.markerCoord);
  const drawToggle = appStore.useState((s) => s.drawToggle);
  const formToggle = appStore.useState((s) => s.formToggle);

  const onLoad = (drawingManager) => {
    return;
  };

  const onPolygonComplete = (polygon) => {
    shapeStore.update((s) => {
      s.currentShapeData = [polygon.getPath().getArray().toString()];
    });

    shapeStore.update((s) => {
      s.currentShape = "Polygon";
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  const onRectangleComplete = (rectangle) => {
    shapeStore.update((s) => {
      s.currentShapeData = rectangle;
    });

    shapeStore.update((s) => {
      s.currentShape = "Rectangle";
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  const onCircleComplete = (circle) => {
    shapeStore.update((s) => {
      s.currentShapeData = circle;
    });

    shapeStore.update((s) => {
      s.currentShape = "Circle";
    });
    appStore.update((s) => {
      s.drawToggle = false;
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  const drawNewShape = () => {
    appStore.update((s) => {
      s.drawToggle = !s.drawToggle;
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

  if (
    //if no shapes in firestore
    polygonCoords.length === 0 &&
    circleCoords.length === 0 &&
    rectangleCoords.length === 0 &&
    !formToggle
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
  } else if (formToggle) {
    return <ShapeInfoForm />;
  } else {
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
