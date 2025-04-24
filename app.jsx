// App.js (Buat nama filenua)
import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Ganti pake api endpoint (Gw belom bikin)
      const response = await axios.get("/api/getPosts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    try {
      // Ganti pake api endpoint (Gw belom bikin)
      await axios.post("/api/createPost", { content, fileUrl });
      setContent("");
      setFileUrl("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      // Ganti pake api endpoint (Gw belom bikin)
      await axios.post(`/api/likePost/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (postId) => {
    try {
      // Ganti pake api endpoint (Gw belom bikin)
      await axios.post(`/api/addComment/${postId}`, { text: comment });
      setComment("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="App">
      <h1>Social Media Platform</h1>

      {/* Buat Post Form */}
      <div>
        <h2>Create a Post</h2>
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {/* List of Posts */}
      <div>
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.content}</h3>
            <img src={post.fileUrl} alt={post.content} style={{ width: "200px" }} />
            <p>Likes: {post.likes}</p>
            <button onClick={() => likePost(post.id)}>Like</button>

            {/* Comments */}
            <h4>Comments</h4>
            {post.comments.map((comment) => (
              <p key={comment.id}>{comment.text}</p>
            ))}

            {/* Add Comment */}
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={() => addComment(post.id)}>Comment</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
