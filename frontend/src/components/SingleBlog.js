import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/blogs/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [id, token]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>
        Back
      </Link>
      <h1 style={styles.title}>{blog.title}</h1>
      <p style={styles.author}>By: {blog.author}</p>
      <p style={styles.date}>
        Posted on: {new Date(blog.createdOn).toLocaleDateString()}
      </p>
      <div style={styles.content}>
        <img src={blog.imageurl} alt={blog.title} style={styles.image} />
        <p style={styles.description}>{blog.description}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    maxWidth: "1700px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: "10px 20px",
    marginBottom: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: "2em",
    marginBottom: "20px",
  },
  content: {
    textAlign: "center",
    width: "100%",
  },
  description: {
    margin: "20px 0",
    fontSize: "1.2em",
    textAlign: "justify",
    padding: "0 60px",
  },
  image: {
    maxWidth: "100%",
    height: "450px",
    borderRadius: "8px",
  },
  author: {
    marginTop: "1px",
    fontStyle: "italic",
    color: "#555",
  },
  date: {
    marginTop: "1px",
    fontStyle: "italic",
    color: "#555",
  },
};
