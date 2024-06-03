import React, { useContext, useEffect } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Layout from "./Layout";
import AuthContext from "./AuthContext";

const LoginPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(7, "Password must be at least 7 characters long")
      .max(30, "Password must be at most 30 characters long")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch("http://localhost:9000/api/blog/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message || "Login failed" });
        }
      } catch (error) {
        setErrors({ form: "Login failed. Please try again later." });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
            {formik.errors.form && (
              <Typography
                variant="body1"
                align="center"
                gutterBottom
                sx={{ color: "red" }}
              >
                {formik.errors.form}
              </Typography>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={formik.handleSubmit}
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={
                  formik.isSubmitting ||
                  !formik.dirty ||
                  !formik.isValid ||
                  !formik.values.email ||
                  !formik.values.password
                }
              >
                Log In
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
