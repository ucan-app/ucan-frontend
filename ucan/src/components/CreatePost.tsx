/*import React from "react";

//type CreatePostProps = {};

//type CreatePostState = {};

// Define the component with explicit return type
const CreatePost: React.FC<{}> = () => {
  return (
    <div>
      <h1>CreatePost Page</h1>
    </div>
  );
};

export default CreatePost;*/


import React from "react";
import { User } from "../types"; // Make sure this path is correct

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
        <p>Posting as: {user.firstName} {user.lastName}</p>
      ) : (
        <p>Please log in to create a post</p>
      )}
      {/* Add your post creation form here */}
    </div>
  );
};

export default CreatePost;