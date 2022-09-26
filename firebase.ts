import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {FIREBASE_API_KEY,FIREBASE_AUTH_DOMAIN,FIREBASE_DATABASE_URL,FIREBASE_PROJECT_ID,FIREBSAE_STORAGE_BUCKET,FIREBASE_MESSAGING_SENDER_ID,FIREBASE_APP_ID,FIREBASE_MEASUREMENT_ID,FIREBASE_EMAIL,FIREBASE_PASSWORD} from './env';

firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBSAE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId : FIREBASE_MEASUREMENT_ID,
});
let initialised = false;
export async function initialise() {
    const result = await firebase.auth().signInWithEmailAndPassword(FIREBASE_EMAIL,FIREBASE_PASSWORD);
    initialised = true;
    return result;
}

export default firebase;