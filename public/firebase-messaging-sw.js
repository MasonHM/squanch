importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBXNYY6DqNDA3tuNSlFqjyHcOuDnrcylpE",
  authDomain: "squanch.firebaseapp.com",
  projectId: "squanch",
  storageBucket: "squanch.appspot.com",
  messagingSenderId: "1090383879006",
  appId: "1:1090383879006:web:3c07c2f17311b98fc10dcf",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
