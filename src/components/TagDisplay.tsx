import React from 'react';
import { Tag, Post, User } from '../types';
import './TagDisplay.css';

interface TagDisplayProps {
  tags?: Tag[];
  onTagClick?: (tag: Tag) => void;
  maxDisplay?: number;
  post?: Post;
  user?: User | null;
  showFullView?: boolean;
  showComments?: boolean;
}

const TagDisplay: React.FC<TagDisplayProps> = ({ 
  tags = [], 
  onTagClick,
  maxDisplay,
  post,
  user,
  showFullView = false,
  showComments = false
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  if (showFullView && post) {
    return (
      <div className="clean-tag-interface">
        <div className="tag-header">
          <div className="tag-title-section">
            <h1 className="tag-title">{post.title}</h1>
            <div className="tag-action-buttons">
              <button className="tag-action-btn">Edit</button>
              <button className="tag-action-btn tag-delete-btn">Delete</button>
            </div>
          </div>
          
          <div className="tag-author-section">
            <div className="tag-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
            <div className="tag-author-name">{user?.fullName || 'Unknown'}</div>
          </div>
          
          <p className="tag-description">{post.description}</p>
          
          <div className="clean-tags-container">
            {displayTags.map(tag => (
              <button
                key={tag.id}
                className="clean-tag"
                onClick={() => onTagClick?.(tag)}
                title={tag.description}
              >
                {tag.name}
              </button>
            ))}
            {remainingCount > 0 && (
              <span className="clean-tag more-tags">
                +{remainingCount} more
              </span>
            )}
          </div>
        </div>


        {showComments && (
          <div className="tag-comments-section">
            <div className="tag-comments-header">
              <h2 className="tag-comments-title">Comments</h2>
              <span className="tag-comments-count">0</span>
            </div>
            
            <button className="tag-add-comment-btn">Add Comment</button>
            
            <div className="tag-no-comments">
              No comments yet. Be the first to comment!
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tag-display">
      {displayTags.map(tag => (
        <span
          key={tag.id}
          className={`tag-chip ${onTagClick ? 'clickable' : ''}`}
          onClick={() => onTagClick?.(tag)}
          title={tag.description}
        >
          {tag.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="tag-chip more-tags">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default TagDisplay;