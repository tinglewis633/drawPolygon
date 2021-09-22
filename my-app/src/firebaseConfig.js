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

export async function addCoords(coords) {
  const db = getFirestore();
  await addDoc(collection(db, "Coords"), {
    coords,
  });
  console.log("successfully added coords!!!!");
  // await setDoc(doc(db, "Coords", docRef.id), {
  //   ...formDoc,
  //   id: docRef.id,
  // });
}

export async function fetchCoords() {
  const db = getFirestore();
  const dataArr = [];
  const querySnapshot = await getDocs(collection(db, "Coords"));
  querySnapshot.forEach((doc) => {
    dataArr.push(doc.data());
  });
  console.log(dataArr);
  console.log("Fectched Data!!!");
  return dataArr;
}
