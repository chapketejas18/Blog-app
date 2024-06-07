import React, { useState, useEffect, useContext } from "react";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useStyles } from "./utils";
import Layout from "./Layout";
import { styled } from "@mui/system";
import { AuthContext } from "./AuthContext";

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

  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
  });

  const [isChanged, setIsChanged] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  const countNonSpaceChars = (str) => str.replace(/\s+/g, "").length;

  useEffect(() => {
    const isTitleChanged = formData.title !== initialTitle;
    const isDescriptionChanged = formData.description !== initialDescription;
    setIsChanged(isTitleChanged || isDescriptionChanged);
  }, [formData, initialTitle, initialDescription]);

  useEffect(() => {
    setTitleCharCount(countNonSpaceChars(formData.title));
    setDescriptionCharCount(countNonSpaceChars(formData.description));
  }, [formData.title, formData.description]);

  const handleChange = (e, charLimit) => {
    const { name, value } = e.target;
    const nonSpaceCharCount = countNonSpaceChars(value);
    if (nonSpaceCharCount <= charLimit) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:9000/api/blogs/${id}`,
        {
          title: formData.title,
          description: formData.description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      navigate("/v1/myblogs");
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
            onChange={(e) => handleChange(e, 70)}
            value={formData.title}
            margin="auto"
            variant="outlined"
          />
          <Typography variant="body2" color="textSecondary">
            {titleCharCount} / 70 characters
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Description
          </InputLabel>
          <ResizableTextarea
            className={classes.font}
            name="description"
            onChange={(e) => handleChange(e, 2000)}
            value={formData.description}
          />
          <Typography variant="body2" color="textSecondary">
            {descriptionCharCount} / 2000 characters
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
