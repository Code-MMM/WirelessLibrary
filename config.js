import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCiN86UJPhcrGUeEcuxX8T8UY9Vee4VE98",
    authDomain: "wireless-lib-5e3d5.firebaseapp.com",
    databaseURL: "https://wireless-lib-5e3d5.firebaseio.com",
    projectId: "wireless-lib-5e3d5",
    storageBucket: "wireless-lib-5e3d5.appspot.com",
    messagingSenderId: "841468468052",
    appId: "1:841468468052:web:7187e10c1a507cce7d46c1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
