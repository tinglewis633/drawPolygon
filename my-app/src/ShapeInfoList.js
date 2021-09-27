import { useEffect } from "react";
import { coordsStore, shapeFormStore } from "./store/store";
import { useParams } from "react-router-dom";
import { addShapeInfo } from "./firebaseConfig";
import "./ShapeInfoList.css";
function ShapeInfoForm() {
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  console.log("POLYGON", circleCoords);
  return (
    <div className='info-list'>
      <h1>Circles</h1>
      {circleCoords.map((circle) => (
        <div key={circle.id}>
          {circle.info.name}, {circle.info.description}
          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
      <h1>Rectangles</h1>
      {rectangleCoords.map((rectangle) => (
        <div key={rectangle.id}>
          {rectangle.info.name}, {rectangle.info.description}
          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
      <h1>Polygons</h1>
      {polygonCoords.map((polygon) => (
        <div key={polygon.id}>
          {polygon.info.name}, {polygon.info.description}
          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ShapeInfoForm;
