import React from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:9000/api/blog/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        alert("Signed Up Successfully");
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrors({ form: errorData.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ form: "Signup failed. Please try again later." });
    }
    setSubmitting(false);
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
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting, isValid, errors, touched }) => (
              <Form noValidate>
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
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  helperText={
                    touched.username && errors.username ? (
                      <ErrorMessage name="username" />
                    ) : null
                  }
                  error={touched.username && !!errors.username}
                />
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  helperText={
                    touched.email && errors.email ? (
                      <ErrorMessage name="email" />
                    ) : null
                  }
                  error={touched.email && !!errors.email}
                />
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  helperText={
                    <>
                      {touched.password && errors.password ? (
                        <ErrorMessage name="password" />
                      ) : null}
                    </>
                  }
                  error={touched.password && !!errors.password}
                />

                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  helperText={
                    <>
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <ErrorMessage name="confirmPassword" />
                      ) : null}
                      <ul>
                        <li>At least one capital letter</li>
                        <li>Between 7 and 30 characters long</li>
                        <li>At least one special character</li>
                      </ul>
                    </>
                  }
                  error={touched.confirmPassword && !!errors.confirmPassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || !isValid}
                >
                  Sign Up
                </Button>
                <Typography align="center" sx={{ mt: 2 }}>
                  Already have an account? <Link to="/">Login</Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
