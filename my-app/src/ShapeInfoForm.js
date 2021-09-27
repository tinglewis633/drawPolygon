import { useEffect } from "react";
import { coordsStore, shapeFormStore } from "./store/store";
import { useParams } from "react-router-dom";
import { addShapeInfo } from "./firebaseConfig";
function ShapeInfoForm() {
  const params = useParams();
  const id = params.id;
  const shape = params.shape;

  const shapeForm = shapeFormStore.useState((s) => s.shapeForm);

  const updateFormDoc = (value, field) => {
    shapeFormStore.update((s) => {
      s.shapeForm = { ...s.shapeForm, [field]: value };
    });
  };

  const submitShapeInfoForm = async () => {
    await addShapeInfo(shapeForm, shape, id);
    window.location.href = "/";
  };
  console.log(shapeForm);
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
        />
        <br />
        <p>Description:</p>
        <input
          required
          onChange={(e) => {
            updateFormDoc(e.target.value, "description");
          }}
          placeholder='Description'
        />
        <br />
        <input type='button' onClick={submitShapeInfoForm} value='Submit' />
        <br />
      </form>
    </div>
  );
}

export default ShapeInfoForm;
