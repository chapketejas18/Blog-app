import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Blog } from "./Blog";
import Layout from "./Layout";

export const Blogs = ({ setIsLoggedIn }) => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9000/api/blogs", {
          headers: {
            Authorization: token,
          },
        });
        setBlogs(response.data);
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
      }
    };
    fetchData();
  }, [setIsLoggedIn, navigate]);

  return (
    <div>
      <Layout setIsLoggedIn={setIsLoggedIn} />
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
    </div>
  );
};
