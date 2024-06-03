import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { Blogs } from "./components/Blogs";
import { UserBlogs } from "./components/UserBlogs";
import { AddBlog } from "./components/AddBlog";
import { UpdateBlog } from "./components/UpdateBlog";
import AuthContext from "./components/AuthContext";

export const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const ProtectedRoute = ({ element }) => {
    if (isLoggedIn === null) {
      return element;
    }
    return isLoggedIn ? element : <Navigate to="/" replace />;
  };

  const AuthRoute = ({ element }) => {
    return isLoggedIn ? <Navigate to="/blogs" replace /> : element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoute element={<LoginPage />} />} />
        <Route
          path="/signup"
          element={<AuthRoute element={<SignupPage />} />}
        />
        <Route path="/blogs" element={<Blogs />} />
        <Route
          path="/myblogs"
          element={<ProtectedRoute element={<UserBlogs />} />}
        />
        <Route
          path="/addblog"
          element={<ProtectedRoute element={<AddBlog />} />}
        />
        <Route
          path="/edit"
          element={<ProtectedRoute element={<UpdateBlog />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
