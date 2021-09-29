import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGB1oKQI6zPMPvN3Fg3OEzkCZkB7eP02Y",
  authDomain: "tut-ionic.firebaseapp.com",
  projectId: "tut-ionic",
  storageBucket: "tut-ionic.appspot.com",
  messagingSenderId: "173911022142",
  appId: "1:173911022142:web:69adabe1043f8d14770f6f",
  measurementId: "G-R434C8WZWR",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export async function addPolygonCoords(coords, infoForm) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Polygon Coords"), {
    coords,
    info: infoForm,
  });
  console.log("successfully added polygon coords!!!!");
  await updateDoc(doc(db, "Polygon Coords", docRef.id), {
    id: docRef.id,
  });
  return docRef.id;
}

export async function addCircleCoords(coords, radius, infoForm) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Circle Coords"), {
    coords,
    radius,
    info: infoForm,
  });
  console.log("successfully added circle coords!!!!");
  await updateDoc(doc(db, "Circle Coords", docRef.id), {
    id: docRef.id,
  });
  return docRef.id;
}
export async function addRectangleCoords(coords, infoForm) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Rectangle Coords"), {
    coords,
    info: infoForm,
  });
  console.log("successfully added rectangle coords!!!!");
  await updateDoc(doc(db, "Rectangle Coords", docRef.id), {
    id: docRef.id,
  });
  return docRef.id;
}

export async function fetchPolygonCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Polygon Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });

  console.log("Fectched Polygon Data!!!");
  return dataArr;
}

export async function fetchCircleCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Circle Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });

  console.log("Fectched Circle Data!!!");

  return dataArr;
}

export async function fetchRectangleCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Rectangle Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });

  console.log("Fectched Rectangle Data!!!");
  return dataArr;
}

export async function fetchCurrentShapeData(shape, id) {
  const db = getFirestore();
  const docRef = doc(db, `${shape} Coords`, id);
  const docSnap = await getDoc(docRef);
  console.log("Fectched Current Shape Data!!!");
  return docSnap.data();
}

export async function deleteShapeData(shape, id) {
  const db = getFirestore();

  await deleteDoc(doc(db, `${shape} Coords`, id));
}

export async function updateShapeInfo(shape, infoForm, id) {
  const db = getFirestore();

  await updateDoc(doc(db, `${shape} Coords`, id), {
    info: infoForm,
  });
}
