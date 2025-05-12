import React from "react";
import { User } from "../types";

// Define props interface to accept the user prop
type CreatePostProps = {
  user: User | null;
};

// Update the component to accept the props
const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  return (
    <div>
      <h1>Create Post</h1>
      {user ? (
        <p>
          Posting as: {user.firstName} {user.lastName}
        </p>
      ) : (
        <p>Please log in to create a post</p>
      )}
      {/* Add your post creation form here */}
    </div>
  );
};

export default CreatePost;
