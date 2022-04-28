import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Init firebase app
initializeApp(firebaseConfig);

// Init services
const db = getFirestore();

// Collection ref
const colRef = collection(db, "books");

// Get collection data
getDocs(colRef)
  .then((snapshot) => {
    const books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
  })
  .catch((err) => console.log(err.message));
