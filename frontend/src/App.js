import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AssignmentsPage from "./components/AssignmentsPage";
import Layout from "./components/Layout";
import SignupPage from "./components/SignupPage";
import { Blogs } from "./components/Blogs";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? (
      <Layout setIsLoggedIn={setIsLoggedIn}>{element}</Layout>
    ) : (
      <Navigate to="/" replace />
    );
  };

  const AuthRoute = ({ element }) => {
    return isLoggedIn ? <Navigate to="/assignments" replace /> : element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          }
        />
        <Route
          path="/signup"
          element={<AuthRoute element={<SignupPage />} />}
        />
        <Route
          path="/assignments"
          element={<ProtectedRoute element={<Blogs />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
