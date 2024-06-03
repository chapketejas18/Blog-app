import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Blog } from "./Blog";
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import InfiniteScroll from "react-infinite-scroll-component";
import AuthContext from "./AuthContext";
import io from "socket.io-client";

export const UserBlogs = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let decodedToken;
  let userid;
  let username;

  try {
    decodedToken = jwtDecode(token);
    userid = decodedToken.existingUser.user._id;
    username = decodedToken.existingUser.user.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    const socket = io("http://localhost:9000");
    socket.on("blogDeleted", (deletedBlogId) => {
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== deletedBlogId)
      );
    });
    socket.on("blogCreated", (newBlog) => {
      if (newBlog.authorid === userid) {
        setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
      }
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
        `http://localhost:9000/api/blogsof/${userid}?page=${page}&limit=2`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const newBlogs = response.data;
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setPage((prevPage) => prevPage + 1);

      if (newBlogs.length < 2) {
        setHasMore(false);
      }

      console.log("Fetched blogs:", newBlogs);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Please log in again.");
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Error fetching blogs:", error);
      }
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

  return (
    <div>
      <Layout setIsLoggedIn={setIsLoggedIn} />
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
        {blogs.map((blog, index) => (
          <Blog
            key={index}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            imageURL={blog.imageurl}
            userName={username}
            isUserBlog={blog.author === username}
            createdOn={blog.createdOn}
            likedBy={blog.likedBy}
            likeCount={blog.likecount}
          />
        ))}
      </InfiniteScroll>
      {blogs.length === 0 && (
        <div style={noBlogsMessageStyle}>
          <h1 style={headingStyle}>No blogs created by you!!</h1>
          <p style={paragraphStyle}>Here is the link to create one</p>
          <Link
            to="/addblog"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = linkStyle.backgroundColor)
            }
          >
            Create Blog
          </Link>
        </div>
      )}
    </div>
  );
};
