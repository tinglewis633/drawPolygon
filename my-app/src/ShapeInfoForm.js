import {
  coordsStore,
  shapeFormStore,
  appStore,
  shapeStore,
} from "./store/store";
import {
  addPolygonCoords,
  addCircleCoords,
  addRectangleCoords,
  updateShapeInfo,
} from "./firebaseConfig";

function ShapeInfoForm() {
  const currentShape = shapeStore.useState((s) => s.currentShape);
  const shapeForm = shapeFormStore.useState((s) => s.shapeForm);
  const currentShapeData = shapeStore.useState((s) => s.currentShapeData);
  const currentShapeID = shapeStore.useState((s) => s.currentShapeID);
  const updateFormDoc = (value, field) => {
    shapeFormStore.update((s) => {
      s.shapeForm = { ...s.shapeForm, [field]: value };
    });
  };

  const submitShapeInfoForm = async () => {
    // condition when user creating rectangle
    if (currentShape === "Rectangle" && currentShapeData) {
      let rectangleCoords = [
        {
          lat: currentShapeData.bounds.tc.g,
          lng: currentShapeData.bounds.Hb.g,
        },
        {
          lat: currentShapeData.bounds.tc.g,
          lng: currentShapeData.bounds.Hb.i,
        },
        {
          lat: currentShapeData.bounds.tc.i,
          lng: currentShapeData.bounds.Hb.i,
        },
        {
          lat: currentShapeData.bounds.tc.i,
          lng: currentShapeData.bounds.Hb.g,
        },
      ];

      await addRectangleCoords(rectangleCoords, shapeForm);

      window.location.href = "/";
    } else if (currentShape === "Rectangle" && !currentShapeData) {
      await updateShapeInfo("Rectangle", shapeForm, currentShapeID);
      window.location.href = "/";
    }

    // condition when user creating rectangle
    if (currentShape === "Circle" && currentShapeData) {
      let circleCoords = {
        lat: currentShapeData.center.lat(),
        lng: currentShapeData.center.lng(),
      };

      await addCircleCoords(circleCoords, currentShapeData.radius, shapeForm);
      window.location.href = "/";
    } else if (currentShape === "Circle" && !currentShapeData) {
      await updateShapeInfo("Circle", shapeForm, currentShapeID);
      window.location.href = "/";
    }

    // condition when user creating polygon
    if (currentShape === "Polygon" && currentShapeData) {
      await addPolygonCoords(currentShapeData, shapeForm);
      window.location.href = "/";
    } else if (currentShape === "Polygon" && !currentShapeData) {
      await updateShapeInfo("Polygon", shapeForm, currentShapeID);
      window.location.href = "/";
    }
  };

  return (
    <div>
      <form>
        <p>Please Enter Area Info</p>
        <br />
        <p>Name:</p>
        <input
          required
          onChange={(e) => {
            updateFormDoc(e.target.value, "name");
          }}
          placeholder='Name'
          value={shapeForm.name}
        />
        <br />
        <p>Description:</p>
        <input
          required
          onChange={(e) => {
            updateFormDoc(e.target.value, "description");
          }}
          placeholder='Description'
          value={shapeForm.description}
        />
        <br />
        <input type='button' onClick={submitShapeInfoForm} value='Submit' />
        <br />
      </form>
    </div>
  );
}

export default ShapeInfoForm;
