import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import firebase from "firebase/compat/app";
import { AuthProvider } from "./components/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

//firebase config
const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AuthProvider>
      <GoogleOAuthProvider clientId=clientId>
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </>
);
