import React, { useState } from "react";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useStyles } from "./utils";
import Layout from "./Layout";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

export const UpdateBlog = ({ setIsLoggedIn }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id,
    title: initialTitle,
    description: initialDescription,
  } = location.state;

  const [inputs, setInputs] = useState({
    title: initialTitle,
    description: initialDescription,
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:9000/api/blogs/${id}`,
        {
          title: inputs.title,
          description: inputs.description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      navigate("/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  return (
    <div>
      <Layout setIsLoggedIn={setIsLoggedIn} />
      <form onSubmit={handleSubmit}>
        <Box
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            className={classes.font}
            fontWeight={"bold"}
            padding={3}
            color="black"
            variant="h2"
            textAlign={"center"}
          >
            Update Your Blog
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Title
          </InputLabel>
          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="auto"
            variant="outlined"
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Description
          </InputLabel>
          <TextField
            className={classes.font}
            name="description"
            onChange={handleChange}
            value={inputs.description}
            margin="auto"
            variant="outlined"
          />
          <Box display="flex" justifyContent="center">
            <Button sx={{ mt: 5, width: 200 }} type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};
