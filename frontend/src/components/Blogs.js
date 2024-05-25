import React, { useEffect, useState } from "react";
import axios from "axios";
import { Blog } from "./Blog";
import Layout from "./Layout";

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/blogs");
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
