import React, { useState, useEffect } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const LoginPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 3 && password.length <= 30;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email address",
      });
    }

    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value)
          ? ""
          : "Password must be between 3 and 30 characters",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateEmail(formData.email) && validatePassword(formData.password)) {
      try {
        const response = await fetch("http://localhost:9000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        console.log(response);

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
        } else {
          const errorData = await response.json();
          setErrors({ ...errors, form: errorData.message || "Login failed" });
        }
      } catch (error) {
        setErrors({ ...errors, form: "Login failed. Please try again later." });
      }
    } else {
      setErrors({ ...errors, form: "Please fix the errors above." });
    }
  };

  return (
    <Layout>
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box>
          <Box
            style={{
              border: "1px solid #ccc",
              padding: "20px",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            {errors.form && (
              <Typography
                variant="body1"
                align="center"
                gutterBottom
                sx={{ color: "red" }}
              >
                {errors.form}
              </Typography>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleLogin}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={
                  !formData.email ||
                  !formData.password ||
                  !!errors.email ||
                  !!errors.password
                }
              >
                Sign In
              </Button>
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage;
