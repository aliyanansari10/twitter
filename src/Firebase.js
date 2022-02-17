import { initializeApp } from 'firebase/app';
// import firebase from 'firebase/app';
import { getStorage } from 'firebase/storage';

import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDDtAajRqHbtm61ErFKEhuPSfYlqbGmvjs',
  authDomain: 'bitrupt-ff26d.firebaseapp.com',
  databaseURL: 'https://bitrupt-ff26d-default-rtdb.firebaseio.com',
  projectId: 'bitrupt-ff26d',
  storageBucket: 'bitrupt-ff26d.appspot.com',
  messagingSenderId: '301704626450',
  appId: '1:301704626450:web:5c156b252ae97b42f9f3cb',
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
//analytics is optional for this tutoral
// firebase.analytics();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();
const auth = getAuth();

export { storage, app, auth, signOut as default };

// export default app;
