export const Blogs = () => {
  const blogs = fetch("http://localhost:9000/api/blogs");
  return <>{console.log(blogs)}</>;
};
