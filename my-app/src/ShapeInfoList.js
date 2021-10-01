import {
  coordsStore,
  shapeFormStore,
  appStore,
  shapeStore,
} from "./store/store";

import { deleteShapeData, fetchCurrentShapeData } from "./firebaseConfig";
import "./ShapeInfoList.css";
function ShapeInfoForm() {
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  const shapeForm = shapeFormStore.useState((s) => s.shapeForm);
  const selectedCoord = coordsStore.useState((s) => s.selectedCoord);
  const deleteCircle = (e) => {
    const id = e.target.getAttribute("id");
    deleteShapeData("Circle", id);
    const tempCircleCoord = circleCoords.filter((coord) => coord.id !== id);
    coordsStore.update((s) => {
      s.circleCoords = tempCircleCoord;
    });
    coordsStore.update((s) => {
      s.selectedCoord = null;
    });
  };
  const deleteRectangle = (e) => {
    const id = e.target.getAttribute("id");
    deleteShapeData("Rectangle", id);
    const tempRectangleCoord = rectangleCoords.filter(
      (coord) => coord.id !== id
    );
    coordsStore.update((s) => {
      s.rectangleCoords = tempRectangleCoord;
    });
    coordsStore.update((s) => {
      s.selectedCoord = null;
    });
  };
  const deletePolygon = (e) => {
    const id = e.target.getAttribute("id");
    deleteShapeData("Polygon", id);
    const tempPolygonCoord = polygonCoords.filter((coord) => coord.id !== id);
    coordsStore.update((s) => {
      s.polygonCoords = tempPolygonCoord;
    });
    coordsStore.update((s) => {
      s.selectedCoord = null;
    });
  };

  const editCircle = async (e) => {
    const id = e.target.getAttribute("id");
    shapeStore.update((s) => {
      s.currentShape = "Circle";
    });
    shapeStore.update((s) => {
      s.currentShapeID = id;
    });
    await fetchCurrentShapeData("Circle", id).then((data) => {
      shapeFormStore.update((s) => {
        s.shapeForm = data.info;
      });
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  const editRectangle = async (e) => {
    const id = e.target.getAttribute("id");
    shapeStore.update((s) => {
      s.currentShape = "Rectangle";
    });
    shapeStore.update((s) => {
      s.currentShapeID = id;
    });
    await fetchCurrentShapeData("Rectangle", id).then((data) => {
      shapeFormStore.update((s) => {
        s.shapeForm = data.info;
      });
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  const editPolygon = async (e) => {
    const id = e.target.getAttribute("id");
    shapeStore.update((s) => {
      s.currentShape = "Polygon";
    });
    shapeStore.update((s) => {
      s.currentShapeID = id;
    });
    await fetchCurrentShapeData("Polygon", id).then((data) => {
      shapeFormStore.update((s) => {
        s.shapeForm = data.info;
      });
    });
    appStore.update((s) => {
      s.formToggle = true;
    });
  };

  return (
    <div className='info-list'>
      <h1>Circles</h1>
      {circleCoords.map((circle) => (
        <div key={circle.id}>
          {circle.info.name}, {circle.info.description}
          <button id={circle.id} onClick={editCircle}>
            Edit
          </button>
          <button id={circle.id} onClick={deleteCircle}>
            Delete
          </button>
        </div>
      ))}
      <h1>Rectangles</h1>
      {rectangleCoords.map((rectangle) => (
        <div key={rectangle.id}>
          {rectangle.info.name}, {rectangle.info.description}
          <button id={rectangle.id} onClick={editRectangle}>
            Edit
          </button>
          <button id={rectangle.id} onClick={deleteRectangle}>
            Delete
          </button>
        </div>
      ))}
      <h1>Polygons</h1>
      {polygonCoords.map((polygon) => (
        <div key={polygon.id}>
          {polygon.info.name}, {polygon.info.description}
          <button id={polygon.id} onClick={editPolygon}>
            Edit
          </button>
          <button id={polygon.id} onClick={deletePolygon}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ShapeInfoForm;
