import React, { useState } from "react";
import { User } from "../types";
import { createPost } from "../api/auth";

type CreatePostProps = {
  user: User | null;
};

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePost = async () => {
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }

    try {
      await createPost({
        title,
        description,
        creatorId: user.userid, // Pass the creatorId from the user prop
      });
      setSuccess("Post created successfully!");
      setTitle(""); // Clear the form
      setDescription("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to create post.");
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      {user ? (
        <p>
          Posting as: {user.fullname}
        </p>
      ) : (
        <p>Please log in to create a post</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div>
        <label>
          <strong>Title:</strong>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Description:</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
          />
        </label>
      </div>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default CreatePost;