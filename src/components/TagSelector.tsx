import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import { getAllTags } from '../api';
import './TagSelector.css';

interface TagSelectorProps {
  selectedTags: number[];
  onTagsChange: (tagIds: number[]) => void;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  selectedTags, 
  onTagsChange, 
  maxTags = 5 
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'CLASSES' | 'CAREERS' | 'COMPANIES'>('CLASSES');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const getTagsByCategory = (category: string) => {
    return allTags.filter(tag => tag.category === category && tag.isActive);
  };

  if (loading) {
    return <div className="tag-selector-loading">Loading tags...</div>;
  }

  return (
    <div className="tag-selector">
      <div className="tag-selector-header">
        <h3>Select Tags ({selectedTags.length}/{maxTags})</h3>
        <div className="category-tabs">
          {['CLASSES', 'CAREERS', 'COMPANIES'].map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category as any)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="tags-grid">
        {getTagsByCategory(activeCategory).map(tag => (
          <button
            key={tag.id}
            className={`tag-button ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
            onClick={() => handleTagToggle(tag.id)}
            disabled={!selectedTags.includes(tag.id) && selectedTags.length >= maxTags}
            title={tag.description}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <h4>Selected Tags:</h4>
          <div className="selected-tags-list">
            {selectedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              return tag ? (
                <span key={tagId} className="selected-tag">
                  {tag.name}
                  <button
                    className="remove-tag"
                    onClick={() => handleTagToggle(tagId)}
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;