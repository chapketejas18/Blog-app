import React, { useState, useEffect, useContext } from "react";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useStyles } from "./utils";
import Layout from "./Layout";
import { styled } from "@mui/system";
import AuthContext from "./AuthContext";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const ResizableTextarea = styled("textarea")({
  width: "100%",
  minHeight: "100px",
  resize: "vertical",
  mb: 1,
  mt: 2,
  fontSize: "18px",
});

export const UpdateBlog = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
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

  const [isChanged, setIsChanged] = useState(false);
  const [titleWordCount, setTitleWordCount] = useState(0);
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);

  useEffect(() => {
    const isTitleChanged = inputs.title !== initialTitle;
    const isDescriptionChanged = inputs.description !== initialDescription;
    setIsChanged(isTitleChanged || isDescriptionChanged);
  }, [inputs, initialTitle, initialDescription]);

  useEffect(() => {
    setTitleWordCount(countWords(inputs.title));
    setDescriptionWordCount(countWords(inputs.description));
  }, [inputs.title, inputs.description]);

  const countWords = (str) => {
    return str.trim().split(/\s+/).length;
  };

  const handleChange = (e, wordLimit) => {
    const { name, value } = e.target;
    const words = countWords(value);
    if (words > wordLimit) {
      const trimmedValue = value.split(/\s+/).slice(0, wordLimit).join(" ");
      setInputs((prevState) => ({
        ...prevState,
        [name]: trimmedValue,
      }));
      if (name === "title") {
        setTitleWordCount(wordLimit);
      } else if (name === "description") {
        setDescriptionWordCount(wordLimit);
      }
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === "title") {
        setTitleWordCount(words);
      } else if (name === "description") {
        setDescriptionWordCount(words);
      }
    }
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
            onChange={(e) => handleChange(e, 30)}
            value={inputs.title}
            margin="auto"
            variant="outlined"
          />
          <Typography variant="body2" color="textSecondary">
            {titleWordCount} / 30 words
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Description
          </InputLabel>
          <ResizableTextarea
            className={classes.font}
            name="description"
            onChange={(e) => handleChange(e, 2000)}
            value={inputs.description}
          />
          <Typography variant="body2" color="textSecondary">
            {descriptionWordCount} / 2000 words
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              sx={{ mt: 5, width: 200 }}
              type="submit"
              disabled={!isChanged}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};
