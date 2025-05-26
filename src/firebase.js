import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  //main db
  apiKey: "AIzaSyBxQAkiIFp5EIs06V9MtjIA97gWGsMKTEk",
  authDomain: "infeara-employee-status.firebaseapp.com",
  projectId: "infeara-employee-status",
  storageBucket: "infeara-employee-status.firebasestorage.app",
  messagingSenderId: "849542560944",
  appId: "1:849542560944:web:79024c39a53a34b5e80f75"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 
const firestore = getFirestore(app);
export { db, storage, auth , firestore}; 
