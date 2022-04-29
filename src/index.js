import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Init firebase app
initializeApp(firebaseConfig);

// Init services
const db = getFirestore();
const auth = getAuth();

// Collection ref
const colRef = collection(db, "books");

// Queries
const q = query(colRef, orderBy("createdAt"));

// Realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  const books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// Adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// Deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// Get a single document
const docRef = doc(db, "books", "D6KrJ2k7CVKsIJLyiymE");

const unsubDoc = onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

// Updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "Updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// Signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log("User created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => console.log(err.message));
});

// Logging in and out
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      loginForm.reset();
      // console.log("User logged in:", cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log("The user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// Unsubscribing from changes (auth, doc & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("Unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
