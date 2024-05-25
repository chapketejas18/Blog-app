import React, { useEffect, useState } from "react";
import axios from "axios";
import { Blog } from "./Blog";
import Layout from "./Layout";

export const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/blogsof/${userid}`
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Layout />
      {blogs.length === 0 && (
        <>
          <h1>No blogs created by you...</h1>
          <p>Here is the link to create one : </p>
        </>
      )}
      {blogs.map((blog, index) => (
        <Blog
          key={index}
          id={index}
          title={blog.title}
          description={blog.description}
          imageURL={blog.imageurl}
          userName={blog.author}
        />
      ))}
    </div>
  );
};
