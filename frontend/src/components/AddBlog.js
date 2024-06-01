import React, { useContext, useState } from "react";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useStyles } from "./utils";
import Layout from "./Layout";
import { styled } from "@mui/system";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
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

export const AddBlog = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const [imgurl, setImageurl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });

  const countWords = (str) => {
    return str.trim().split(/\s+/).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      const words = countWords(value);
      if (words > 200) {
        const trimmedDescription = value.split(/\s+/).slice(0, 200).join(" ");
        setInputs((prevState) => ({
          ...prevState,
          [name]: trimmedDescription,
        }));
        setWordCount(200);
      } else {
        setInputs((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        setWordCount(words);
      }
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsUploading(true);
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);

      fileRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
          setImageurl(downloadURL);
          setInputs((prevState) => ({
            ...prevState,
            imageURL: downloadURL,
          }));
          setIsUploading(false);
        });
      });
    } else {
      console.log("No file selected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.existingUser.user._id;
      console.log(token);
      const res = await axios.post(
        "http://localhost:9000/api/createblog",
        {
          title: inputs.title,
          description: inputs.description,
          imageurl: imgurl,
          author: userId,
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
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Error adding blog:", error);
        if (imgurl) {
          const storageRef = firebase.storage().refFromURL(imgurl);
          try {
            await storageRef.delete();
          } catch (deleteError) {
            console.error("Error deleting image from Firebase:", deleteError);
          }
        }
      }
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
            Post Your Blog
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
          <ResizableTextarea
            className={classes.font}
            name="description"
            onChange={handleChange}
            value={inputs.description}
          />
          <Typography variant="body2" color="textSecondary">
            {wordCount} / 200 words
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Image
          </InputLabel>
          <input
            type="file"
            onChange={handleFileUpload}
            aria-label="File upload input"
            style={{ marginBottom: "16px", marginTop: "8px", fontSize: "18px" }}
          />
          {isUploading ? (
            <Typography variant="body1" textAlign="center">
              Uploading...
            </Typography>
          ) : (
            <Box display="flex" justifyContent="center">
              <Button
                sx={{ mt: 5, width: 200 }}
                type="submit"
                disabled={!imgurl.length}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </div>
  );
};
