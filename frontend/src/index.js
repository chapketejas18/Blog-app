import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import firebase from "firebase/compat/app";
import { AuthProvider } from "./components/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const firebaseConfig = {
  apiKey: "AIzaSyC7DLM6rspr6JgoooPkTE1Zb2QZXdcjxQo",
  authDomain: "blogs-93765.firebaseapp.com",
  projectId: "blogs-93765",
  storageBucket: "blogs-93765.appspot.com",
  messagingSenderId: "911912315585",
  appId: "1:911912315585:web:9f2c8a7e77a1a8610c4240",
};

firebase.initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AuthProvider>
      <GoogleOAuthProvider clientId="287908866352-0pjr401q6fg1d0ko47429g371j7mkm5f.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </>
);
