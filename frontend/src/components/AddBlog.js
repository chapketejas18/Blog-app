import React, { useContext, useState, useRef } from "react";
import {
  Box,
  Button,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useStyles } from "./utils";
import Layout from "./Layout";
import { styled } from "@mui/system";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
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

export const AddBlog = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imgurl, setImageurl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e, charLimit) => {
    const { name, value } = e.target;
    const charCount = value.length;
    if (charCount > charLimit) {
      const trimmedValue = value.substring(0, charLimit);
      setInputs((prevState) => ({
        ...prevState,
        [name]: trimmedValue,
      }));
      if (name === "title") {
        setTitleCharCount(charLimit);
      } else if (name === "description") {
        setDescriptionCharCount(charLimit);
      }
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === "title") {
        setTitleCharCount(charCount);
      } else if (name === "description") {
        setDescriptionCharCount(charCount);
      }
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsUploading(true);
      setImagePreview(URL.createObjectURL(selectedFile));
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

  const removeImageFromCloud = async () => {
    if (imgurl) {
      const storageRef = firebase.storage().refFromURL(imgurl);
      try {
        await storageRef.delete();
        setImagePreview("");
        setImageurl("");
        setInputs((prevState) => ({
          ...prevState,
          imageURL: "",
        }));
        navigate("/v1/myblogs");
      } catch (deleteError) {
        console.error("Error deleting image from Firebase:", deleteError);
      }
    } else {
      navigate("/v1/myblogs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.existingUser.user._id;
      const res = await axios.post(
        "http://localhost:9000/api/blog/createblog",
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
      setOpenSnackbar(true);
      setInputs({
        title: "",
        description: "",
        imageURL: "",
      });
      setImagePreview("");
      setTitleCharCount(0);
      setDescriptionCharCount(0);
      setImageurl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        navigate("/v1/login");
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
          <Button
            onClick={removeImageFromCloud}
            variant="contained"
            color="primary"
            style={{ width: "100px" }}
          >
            Go Back
          </Button>
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
            onChange={(e) => handleChange(e, 70)}
            value={inputs.title}
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
            value={inputs.description}
          />
          <Typography variant="body2" color="textSecondary">
            {descriptionCharCount} / 2000 characters
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Image
          </InputLabel>
          <input
            type="file"
            onChange={handleFileUpload}
            aria-label="File upload input"
            style={{ marginBottom: "16px", marginTop: "8px", fontSize: "18px" }}
            ref={fileInputRef}
            accept=".jpg, .jpeg"
          />
          {imagePreview && (
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                src={imagePreview}
                alt="Selected"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </Box>
          )}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        message={"Blog created Successfully!!!"}
        onClose={handleCloseSnackbar}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};
