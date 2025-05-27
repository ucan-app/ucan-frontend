import React, { useEffect, useState } from "react";
import { UserReply, User } from "../types";
import { getProfile } from "../api";
import { useNavigate } from "react-router-dom";
import "./Reply.css";

interface ReplyProps {
  reply: UserReply;
}

const Reply: React.FC<ReplyProps> = ({ reply }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await getProfile(reply.authorId);
        setAuthor(userData);
      } catch (error) {
        console.error("Failed to fetch reply author:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [reply.authorId]);

  const handleAuthorClick = () => {
    if (author) {
      navigate(`/profile/${author.userId}`);
    }
  };

  return (
    <div className="reply">
      <div className="reply-header">
        <span className="reply-author">
          {loading ? "Loading..." : (
            <span 
              className="author-fullname clickable-author"
              onClick={handleAuthorClick}
              title="View profile"
            >
              {author?.fullName || "Anonymous"}
            </span>
          )}
        </span>
        <span className="reply-date">
          {reply.createdAt && new Date(reply.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="reply-content">
        {reply.content}
      </div>
    </div>
  );
};

export default Reply;