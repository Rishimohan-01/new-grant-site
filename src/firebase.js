// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnV4gbu-_qvv0XUMIC0BucKIMp-1eypuk",
  authDomain: "microsite-b835d.firebaseapp.com",
  projectId: "microsite-b835d",
  storageBucket: "microsite-b835d.appspot.com",
  messagingSenderId: "211250380169",
  appId: "1:211250380169:web:f3b387d408de418a5e7558",
  measurementId: "G-L1K3Z1SNVZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export default app;
