import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
}) => {
  const navigate = useNavigate();
  const deleteRequest = async () => {
    const token = localStorage.getItem("token");
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
    deleteRequest()
      .then(alert("Deleted Successfully."))
      .then(() => navigate("/blogs"));
  };

  const handleEdit = () => {
    navigate("/edit", { state: { id, title, description } });
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "59vh",
        padding: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 1000 }} key={id}>
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
                <IconButton aria-label="delete">
                  <DeleteIcon onClick={handleDelete} />
                </IconButton>
              </>
            )
          }
          title={
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
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
        <CardMedia component="img" height="194" image={imageURL} />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {expanded ? description : truncateText(description, 150)}
            {description.length > 150 && (
              <Typography
                variant="body2"
                color="primary"
                onClick={handleExpandClick}
                sx={{ cursor: "pointer" }}
              >
                {" "}
                {expanded ? "Read Less" : "Read More"}
              </Typography>
            )}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};
