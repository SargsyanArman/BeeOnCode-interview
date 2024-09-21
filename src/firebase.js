import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDmWAnCzlvR6MZV99EQjJZcikTyTnfRGFI",
    authDomain: "beeoncode-interview.firebaseapp.com",
    projectId: "beeoncode-interview",
    storageBucket: "beeoncode-interview.appspot.com",
    messagingSenderId: "1005777650525",
    appId: "1:1005777650525:web:a75e1814db16c035c85eb4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
