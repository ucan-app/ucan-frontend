import React, { useState, useEffect } from 'react';
import { getProfilePictureUrl } from '../api/image';
import './ProfilePictureDisplay.css';

interface ProfilePictureDisplayProps {
  userId: number;
  userName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ProfilePictureDisplay: React.FC<ProfilePictureDisplayProps> = ({
  userId,
  userName,
  size = 'medium',
  className = ''
}) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        setLoading(true);
        const pictureUrl = await getProfilePictureUrl(userName);
        setProfilePictureUrl(pictureUrl);
        setImageError(false);
      } catch (error) {
        console.log("No profile picture found for user:", userId);
        setProfilePictureUrl(null);
        setImageError(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [userId]);

  const handleImageError = () => {
    console.error("Failed to load profile picture:", profilePictureUrl);
    setImageError(true);
    setProfilePictureUrl(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className={`profile-picture-display ${size} ${className} loading`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (profilePictureUrl && !imageError) {
    return (
      <div className={`profile-picture-display ${size} ${className}`}>
        <img 
          src={profilePictureUrl} 
          alt={`${userName}'s profile`}
          className="profile-picture-img"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Show placeholder with initials
  return (
    <div className={`profile-picture-display ${size} ${className} placeholder`}>
      <span className="profile-initials">
        {getInitials(userName)}
      </span>
    </div>
  );
};

export default ProfilePictureDisplay;