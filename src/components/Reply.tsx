import React, { useEffect, useState } from "react";
import { UserReply, User } from "../types";
import { getProfile } from "../api";
import "./Reply.css";

interface ReplyProps {
  reply: UserReply;
}

const Reply: React.FC<ReplyProps> = ({ reply }) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="reply">
      <div className="reply-header">
        <span className="reply-author">
          {loading ? "Loading..." : (
            <>
              <span className="author-fullname">{author?.fullName || "Anonymous"}</span>
            </>
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