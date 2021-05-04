import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDUgtkBO75lcdJzMo-kiPAqq9rGyGItm8I",
  authDomain: "willy-app-9bc2a.firebaseapp.com",
  projectId: "willy-app-9bc2a",
  storageBucket: "willy-app-9bc2a.appspot.com",
  messagingSenderId: "268858439894",
  appId: "1:268858439894:web:9eca4e102484a97d56f177",
};
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
