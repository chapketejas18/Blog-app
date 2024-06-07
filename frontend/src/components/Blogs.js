import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Blog } from "./Blog";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { AuthContext } from "./AuthContext";
import io from "socket.io-client";
import { Grid, Box } from "@mui/material";

export const Blogs = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const socket = io("http://localhost:9000");
    socket.on("blogDeleted", (deletedBlogId) => {
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== deletedBlogId)
      );
    });
    socket.on("blogCreated", (newBlog) => {
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    });
    socket.on("blogUpdated", (updatedBlog) => {
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        )
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/blogs?page=${page}&limit=6`
      );
      const newBlogs = response.data;

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setPage((prevPage) => prevPage + 1);

      if (newBlogs.length < 6) {
        setHasMore(false);
      }

      console.log("Fetched blogs:", newBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const noBlogsMessageStyle = {
    textAlign: "center",
    marginTop: "50px",
  };

  const headingStyle = {
    fontSize: "2em",
    color: "#333",
  };

  const paragraphStyle = {
    fontSize: "1.2em",
    color: "#666",
  };

  const linkStyle = {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "1em",
    color: "#fff",
    backgroundColor: "#007bff",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  };

  const linkHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <div>
      <Layout setIsLoggedIn={setIsLoggedIn} />
      {blogs.length === 0 && !hasMore && (
        <div style={noBlogsMessageStyle}>
          <h1 style={headingStyle}>No blogs created posted by anyone!!</h1>
          {isLoggedIn && (
            <>
              <p style={paragraphStyle}>
                Here is the link to give first contribution to this application
              </p>
              <Link
                to="/v1/addblog"
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    linkHoverStyle.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = linkStyle.backgroundColor)
                }
              >
                Create Blog
              </Link>
            </>
          )}
        </div>
      )}
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchData}
        hasMore={hasMore}
        loader={
          <center>
            <h4>Loading...</h4>
          </center>
        }
      >
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Grid container spacing={2}>
            {blogs.map((blog, index) => (
              <Blog
                key={index}
                id={blog._id}
                title={blog.title}
                description={blog.description}
                imageURL={blog.imageurl}
                userName={blog.author}
                createdOn={blog.createdOn}
                likedBy={blog.likedBy}
                likeCount={blog.likecount}
              />
            ))}
          </Grid>
        </Box>
      </InfiniteScroll>
    </div>
  );
};
