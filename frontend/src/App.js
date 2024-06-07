import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Blogs } from "./components/Blogs";
import { UserBlogs } from "./components/UserBlogs";
import { AddBlog } from "./components/AddBlog";
import { UpdateBlog } from "./components/UpdateBlog";
import { AuthContext } from "./components/AuthContext";
import { SingleBlog } from "./components/SingleBlog";

export const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const ProtectedRoute = ({ element }) => {
    if (isLoggedIn === null) {
      return element;
    }
    return isLoggedIn ? element : <Navigate to="/v1/login" replace />;
  };

  const AuthRoute = ({ element }) => {
    return isLoggedIn ? <Navigate to="/" replace /> : element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/v1/login"
          element={<AuthRoute element={<LoginPage />} />}
        />
        <Route
          path="/v1/signup"
          element={<AuthRoute element={<SignupPage />} />}
        />
        <Route path="/" element={<Blogs />} />
        <Route
          path="/v1/myblogs"
          element={<ProtectedRoute element={<UserBlogs />} />}
        />
        <Route
          path="/v1/addblog"
          element={<ProtectedRoute element={<AddBlog />} />}
        />
        <Route
          path="/v1/edit"
          element={<ProtectedRoute element={<UpdateBlog />} />}
        />
        <Route
          path="/v1/blog/:id"
          element={<ProtectedRoute element={<SingleBlog />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
