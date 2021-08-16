import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "bharatsave-4c86e.firebaseapp.com",
  projectId: "bharatsave-4c86e",
  storageBucket: "bharatsave-4c86e.appspot.com",
  messagingSenderId: "511380934505",
  appId: "1:511380934505:web:f7c0963a41e0d2c981b7f8",
  measurementId: "G-Y8ZW18QK17",
};
firebase.initializeApp(config);
export default firebase;
