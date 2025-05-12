import React from "react";

/*type ViewPostProps = {
  post: Post;
  postComments: PostComment[];
};

type ViewPostState = {};*/

// Define the component with explicit return type
const ViewPost: React.FC<{}> = () => {
  return (
    <div>
      <h1>ViewPost Page</h1>
    </div>
  );
};

export default ViewPost;
