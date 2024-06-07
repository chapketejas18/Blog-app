import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Snackbar,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { red } from "@mui/material/colors";
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const socket = io("http://localhost:9000", {
  reconnection: true,
});

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const Blog = ({
  id,
  title,
  description,
  imageURL,
  userName,
  isUserBlog,
  createdOn,
  likedBy,
  likeCount,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const decodedToken = token ? jwtDecode(token) : null;
  const userid = decodedToken ? decodedToken.existingUser.user._id : null;
  const [liked, setLiked] = useState(likedBy.includes(userid));
  const [likes, setLikes] = useState(likeCount);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [navigateOnClose, setNavigateOnClose] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const vertical = "bottom";
  const horizontal = "left";

  useEffect(() => {
    socket.on("likeStatusUpdated", ({ blogId, likes, likedBy }) => {
      if (blogId === id) {
        setLikes(likes);
        setLiked(likedBy.includes(userid));
      }
    });

    return () => {
      socket.off("likeStatusUpdated");
    };
  }, [id, userid]);

  const deleteRequest = async () => {
    const res = await axios
      .delete(`http://localhost:9000/api/blogs/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const handleDelete = () => {
    setDialogOpen(false);
    deleteRequest().then(() => {
      setSnackbarMessage("Deleted Successfully.");
      setSnackbarOpen(true);
    });
  };

  const handleEdit = () => {
    navigate("/v1/edit", { state: { id, title, description } });
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      setSnackbarMessage("Log in to like the blogs");
      setSnackbarOpen(true);
      setNavigateOnClose(true);
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:9000/api/blogs/${id}/like`,
        { userid },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = res.data;
      setLiked(data.blog.likedBy.includes(userid));
      setLikes(data.blog.likecount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    const blogUrl = `http://localhost:3000/v1/blog/${id}`;
    navigator.clipboard
      .writeText(blogUrl)
      .then(() => {
        setSnackbarMessage("Blog link copied to clipboard!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleClick = () => {
    navigate(`/v1/blog/${id}`);
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return `Posted on ${postDate.toLocaleDateString(undefined, options)}`;
    } else if (diffHours > 0) {
      return `Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `Posted ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `Posted just now`;
    }
  };

  const openDeleteDialog = () => {
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          width: "100%",
          margin: 2,
          height: 510,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        key={id}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="blog">
              {userName.charAt(0)}
            </Avatar>
          }
          action={
            isUserBlog && (
              <>
                <IconButton aria-label="edit" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={openDeleteDialog}>
                  <DeleteIcon />
                </IconButton>
              </>
            )
          }
          title={
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
              onClick={handleClick}
            >
              {title}
            </Typography>
          }
          subheader={
            <>
              <Typography variant="body2" color="text.primary">
                {userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(createdOn)}
              </Typography>
            </>
          }
        />
        <CardMedia
          component="img"
          height="194"
          image={imageURL}
          sx={{ objectFit: "contain", cursor: "pointer" }}
          onClick={handleClick}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            onClick={handleClick}
          >
            {truncateText(description, 140)}
            {description.length > 140 && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleClick}
              >
                {" "}
                Read More
              </Typography>
            )}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleLike}>
            <FavoriteIcon sx={{ color: liked ? red[500] : "inherit" }} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likes}
          </Typography>
          <IconButton aria-label="share" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
          if (navigateOnClose) {
            setNavigateOnClose(false);
            navigate("/v1/login");
          }
        }}
        message={snackbarMessage}
        key={vertical + horizontal}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              setSnackbarOpen(false);
              if (navigateOnClose) {
                setNavigateOnClose(false);
                navigate("/v1/login");
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Dialog
        open={dialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Blog"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this blog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
