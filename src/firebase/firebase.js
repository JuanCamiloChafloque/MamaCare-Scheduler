const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyB0isQaLajZfUJRQUopi8bo8mZX0Xw8EFk",
  authDomain: "mamacare-b3a03.firebaseapp.com",
  databaseURL: "https://mamacare-b3a03-default-rtdb.firebaseio.com",
  projectId: "mamacare-b3a03",
  storageBucket: "mamacare-b3a03.appspot.com",
  messagingSenderId: "12189577709",
  appId: "1:12189577709:web:7509f9e1332e5752e037e4",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = db;
