import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBUBuwAH0V9gNE1v7Xs-pBsh2z1NOMCUU",
  authDomain: "instagram-clone-502d5.firebaseapp.com",
  databaseURL: "https://instagram-clone-502d5-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-502d5",
  storageBucket: "instagram-clone-502d5.appspot.com",
  messagingSenderId: "99892139667",
  appId: "1:99892139667:web:661abb8114bad2a6269f66",
  measurementId: "G-TPGY4NVKLK",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
