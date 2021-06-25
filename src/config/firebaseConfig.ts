import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBLiBWDFdarxlu30vHKgnjBpxRrQwgh7j0",
  authDomain: "turnkey-charter-317009.firebaseapp.com",
  projectId: "turnkey-charter-317009",
  storageBucket: "turnkey-charter-317009.appspot.com",
  messagingSenderId: "750798661246",
  appId: "1:750798661246:web:b59a5f371f192f72245a2f",
  measurementId: "G-TP99L22646"
};
let fb = firebase.initializeApp(firebaseConfig);

export default fb;
