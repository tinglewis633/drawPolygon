// importing components for react-google-map
import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useRef } from "react";
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
  const mapCenterCoord = coordsStore.useState((s) => s.mapCenterCoord);
  const selectedCoord = coordsStore.useState((s) => s.selectedCoord);
  const markerCoord = appStore.useState((s) => s.markerCoord);
  const drawToggle = appStore.useState((s) => s.drawToggle);
  const formToggle = appStore.useState((s) => s.formToggle);
  const currentShapeData = shapeStore.useState((s) => s.currentShapeData);
  const mapRef = useRef(null);

  const onDrawingLoad = (drawingManager) => {
    return;
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };
  function handleCenter() {
    if (!mapRef.current) return;
    const lat = mapRef.current.getCenter().lat();
    const lng = mapRef.current.getCenter().lng();
    const newCenter = { lat, lng };

    coordsStore.update((s) => {
      s.mapCenterCoord = newCenter;
    });
  }
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

  const clickCircle = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const coord = { lat, lng };
    coordsStore.update((s) => {
      s.selectedCoord = coord;
    });
    circleCoords.forEach((coord) => {
      const circleRaidusInDegree = (coord.radius / 1.11) * 0.00001;
      const circleX = coord.coords.lng;
      const circleY = coord.coords.lat;
      const xDifference = Math.abs(lng - circleX);
      const yDifference = Math.abs(lat - circleY);
      const pointRaidus = Math.sqrt(
        xDifference * xDifference + yDifference * yDifference
      );

      if (circleRaidusInDegree > pointRaidus) {
        shapeStore.update((s) => {
          s.currentShapeData = coord;
        });
      }
    });
  };

  const clickRectangle = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const coord = { lat, lng };
    coordsStore.update((s) => {
      s.selectedCoord = coord;
    });
    rectangleCoords.forEach((coord) => {
      if (
        coord.coords[2].lat > lat &&
        coord.coords[0].lat < lat &&
        coord.coords[2].lng > lng &&
        coord.coords[0].lng < lng
      ) {
        shapeStore.update((s) => {
          s.currentShapeData = coord;
        });
      }
    });
  };

  const clickPolygon = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const coord = { lat, lng };
    coordsStore.update((s) => {
      s.selectedCoord = coord;
    });

    polygonCoords.forEach((coord) => {
      let count = 0;

      for (let i = 0; i < coord.coords.length - 1; i++) {
        if (
          (coord.coords[i].lat > lat && coord.coords[i + 1].lat < lat) ||
          (coord.coords[i].lat < lat && coord.coords[i + 1].lat > lat)
        ) {
          const slope =
            (coord.coords[i + 1].lat - coord.coords[i].lat) /
            (coord.coords[i + 1].lng - coord.coords[i].lng);
          const intercept =
            coord.coords[i + 1].lat - slope * coord.coords[i + 1].lng;
          const cross = (lat - intercept) / slope;
          if (cross > lng) {
            count = count + 1;
          }
        }
      }

      if (count % 2 === 1) {
        shapeStore.update((s) => {
          s.currentShapeData = coord;
        });
      }
    });
  };
  console.log("HEIHS", selectedCoord);
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
            onLoad={onMapLoad}
            onDragEnd={handleCenter}
            center={mapCenterCoord}
            version='weekly'
            on
          >
            <DrawingManager
              onLoad={onDrawingLoad}
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
              onLoad={onMapLoad}
              onDragEnd={handleCenter}
              center={mapCenterCoord}
              version='weekly'
              on
            >
              {drawToggle && (
                <DrawingManager
                  onLoad={onDrawingLoad}
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
                  onClick={clickCircle}
                />
              ))}
              {/*For each polygon coord output a polygon  */}
              {polygonCoords.map((coord) => {
                return (
                  <Polygon
                    onClick={clickPolygon}
                    path={coord.coords}
                    key={coord.id}
                  />
                );
              })}
              {/*For each rectangle coord output a rectangle  */}
              {rectangleCoords.map((coord) => {
                return (
                  <Polygon
                    onClick={clickRectangle}
                    path={coord.coords}
                    key={coord.id}
                  />
                );
              })}

              {/* when a shape is clicked, set latlng to selectedCoord and show infowindow */}
              {selectedCoord && currentShapeData && (
                <InfoWindow
                  position={selectedCoord}
                  onCloseClick={() => {
                    coordsStore.update((s) => {
                      s.selectedCoord = null;
                    });
                  }}
                >
                  <div>
                    <h1>Info</h1>
                    <h4>Name:</h4>
                    <p>{currentShapeData.info.name}</p>
                    <h4>Description:</h4>
                    <p>{currentShapeData.info.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <ShapeInfoList />
      </div>
    );
  }
}

export default App;
