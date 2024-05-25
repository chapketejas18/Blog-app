import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 3 && password.length <= 30;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let error = "";
    switch (name) {
      case "username":
        error = value ? "" : "Username is required";
        break;
      case "email":
        error = validateEmail(value) ? "" : "Invalid email address";
        break;
      case "password":
        error = validatePassword(value)
          ? ""
          : "Password must be 3-30 characters long";
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value)
          ? ""
          : "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !errors.username &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    ) {
      try {
        const response = await fetch("http://localhost:9000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        console.log(response);

        if (response.ok) {
          alert("Signed Up Successfully");
          navigate("/");
        } else {
          const errorData = await response.json();
          setErrors({ ...errors, form: errorData.message || "Signup failed" });
        }
      } catch (error) {
        setErrors({
          ...errors,
          form: "Signup failed. Please try again later.",
        });
      }
    } else {
      setErrors({ ...errors, form: "Please fix the errors above" });
    }
  };

  return (
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
        <Box style={{ border: "1px solid #ccc", padding: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Signup
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
            onSubmit={handleSignup}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                !formData.username ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                !!errors.username ||
                !!errors.email ||
                !!errors.password ||
                !!errors.confirmPassword
              }
            >
              Sign Up
            </Button>
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account? <Link to="/">Login</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
