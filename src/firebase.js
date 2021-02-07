import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB3iVoyZillyXIUMncRR4-Q6kU_c3eWKMo",
    authDomain: "joy-search.firebaseapp.com",
    projectId: "joy-search",
    storageBucket: "joy-search.appspot.com",
    messagingSenderId: "1054933263747",
    appId: "1:1054933263747:web:a3ea1782c97ace9897c2b6",
    measurementId: "G-PG07XL973S"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
export default db;