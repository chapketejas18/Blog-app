import React, { useEffect, useState } from "react";
import axios from "axios";
import { Blog } from "./Blog";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const UserBlogs = ({ setIsLoggedIn }) => {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userid = decodedToken.existingUser._id;
  const username = decodedToken.existingUser.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:9000/api/blogsof/${userid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, [userid]);

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
        />
      ))}
    </div>
  );
};
