import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout";
import SignupPage from "./components/SignupPage";
import { Blogs } from "./components/Blogs";
import { UserBlogs } from "./components/UserBlogs";
import { AddBlog } from "./components/AddBlog";
import { UpdateBlog } from "./components/UpdateBlog";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/" replace />;
  };

  const AuthRoute = ({ element }) => {
    return isLoggedIn ? <Navigate to="/blogs" replace /> : element;
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
          path="/blogs"
          element={
            <ProtectedRoute element={<Blogs setIsLoggedIn={setIsLoggedIn} />} />
          }
        />
        <Route
          path="/myblogs"
          element={
            <ProtectedRoute
              element={<UserBlogs setIsLoggedIn={setIsLoggedIn} />}
            />
          }
        />
        <Route
          path="/addblog"
          element={
            <ProtectedRoute
              element={<AddBlog setIsLoggedIn={setIsLoggedIn} />}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute
              element={<UpdateBlog setIsLoggedIn={setIsLoggedIn} />}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
