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

export async function addPolygonCoords(coords) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Polygon Coords"), {
    coords,
  });
  console.log("successfully added polygon coords!!!!");
  await updateDoc(doc(db, "Polygon Coords", docRef.id), {
    id: docRef.id,
  });
}

export async function addCircleCoords(coords, radius) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Circle Coords"), {
    coords,
    radius,
  });
  console.log("successfully added circle coords!!!!");
  await updateDoc(doc(db, "Circle Coords", docRef.id), {
    id: docRef.id,
  });
}
export async function addRectangleCoords(coords) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "Rectangle Coords"), {
    coords,
  });
  console.log("successfully added rectangle coords!!!!");
  await updateDoc(doc(db, "Rectangle Coords", docRef.id), {
    id: docRef.id,
  });
}

export async function fetchPolygonCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Polygon Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });

  console.log("Fectched Polygon Data!!!");
  return dataArr.reverse();
}

export async function fetchCircleCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Circle Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });

  console.log("Fectched Circle Data!!!");

  return dataArr.reverse();
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
