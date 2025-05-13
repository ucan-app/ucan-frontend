import React from "react";
import { Post, PostComment, calculatePostScore } from "../types";
import Comment from "./Comment";

interface PostFullProps {
  post: Post;
  comments: PostComment[];
}

const PostFull: React.FC<PostFullProps> = ({ post, comments }) => {
  return (
    <div className="post-full">
      <div className="post-full-header">
        <h2 className="post-full-title">{post.title}</h2>
        <span className="post-full-score">
          Score: {calculatePostScore(post)}
        </span>
      </div>
      <div className="post-full-content">{post.content}</div>
      <div className="post-full-date">
        {post.createdAt instanceof Date
          ? post.createdAt.toLocaleDateString()
          : new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="post-full-comments">
        {comments.map((comment) => (
          <Comment key={comment.cid} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default PostFull;
