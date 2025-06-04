import React, { useState } from "react";
import { User } from "../types";
import { createPost } from "../api";
import { validateImageFile } from "../api/image";
import ImageUpload from "../components/ImageUpload";
import "./CreatePost.css";

type CreatePostProps = {
  user: User | null;
};

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handlePost = async () => {
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }

    if (selectedImage) {
      const validation = validateImageFile(selectedImage);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid image file');
        return;
      }
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createPost({
        title,
        description,
        creatorId: user.userId,
        image: selectedImage || undefined,
      });
      setSuccess("Post created successfully!");
      setTitle("");
      setDescription("");
      setSelectedImage(null);
    } catch (err: any) {
      setError(err.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  if (!user) {
    return (
      <div className="create-post-container">
        <div className="login-prompt">
          <h2>Please log in to create a post</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <h1 className="create-post-header">Create Post</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>Post Image (Optional)</label>
        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          isUploading={isSubmitting}
          className="post-image-upload"
          label="Add Image to Post"
          showPreview={true}
        />
      </div>

      <button 
        className="submit-button"
        onClick={handlePost}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Post"}
      </button>
    </div>
  );
};

export default CreatePost;