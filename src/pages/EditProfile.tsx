import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, User } from "../types";
import { updateProfile, addBadge, removeBadge, getProfile } from "../api";
import "./EditProfile.css";

type EditProfileProps = {
  user: User | null;
  onSave: (updatedUser: User) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialUser: User | null = user || (location.state && location.state.user);

  const [bio, setBio] = useState(initialUser?.bio || "");
  const [graduationYear, setGraduationYear] = useState(initialUser?.graduationYear || "");
  const [linkedinUrl, setLinkedin] = useState(initialUser?.linkedinUrl || "");
  const [personalWebsite, setPersonalWebsite] = useState(initialUser?.personalWebsite || "");

  // Badge management - now properly as string[]
  const [badges, setBadges] = useState<Badge[]>(initialUser?.badges || []);
  const [newBadgeEmail, setNewBadgeEmail] = useState("");
  const [addingBadge, setAddingBadge] = useState(false);
  const [removingBadges, setRemovingBadges] = useState<Set<string>>(new Set());

  if (!initialUser) {
    return <p>No user data available.</p>;
  }

   // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeEmail.trim()) return; // trim removes whitespace

    // Validate email format
    if (!validateEmail(newBadgeEmail.trim())) {
      alert("Please enter a valid email address (e.g., user@amazon.com)");
      return;
    }

    setAddingBadge(true);
    try {
      //const organizationName = newBadgeOrg.trim().toUpperCase();
      await addBadge(newBadgeEmail.trim());
      
      // Refresh user profile to get updated badges
      const updatedUserData = await getProfile(initialUser.userId);
      setBadges(updatedUserData.badges || []);
      
      setNewBadgeEmail("");
      console.log("Badge added successfully");
    } catch (error) {
      console.error("Failed to add badge:", error);
      alert("Failed to add badge. Please make sure you're using a valid organizational email address.");
    } finally {
      setAddingBadge(false);
    }
  };

  const handleRemoveBadge = async (organizationName: string) => {
    setRemovingBadges(prev => new Set(prev).add(organizationName));
    const orgNameUpper = organizationName.toUpperCase();
    console.log("Removing badge:", orgNameUpper);
    try {
      await removeBadge(organizationName);
      
      // Remove badge from local state
      setBadges(prev => prev.filter(badge => badge.organizationName !== organizationName));
      
      console.log("Badge removed successfully");
    } catch (error) {
      console.error("Failed to remove badge:", error);
      alert("Failed to remove badge. Please try again.");
    } finally {
      setRemovingBadges(prev => {
        const newSet = new Set(prev);
        newSet.delete(organizationName);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...initialUser,
      id: initialUser.id,
      userId: initialUser.userId,
      fullName: initialUser.fullName,
      linkedinUrl,
      personalWebsite,
      bio,
      graduationYear: parseInt(graduationYear as string, 10),
      //badges: initialUser.badges 
    };
    
    try {
      const savedUser = await updateProfile(updatedUser);
      onSave(savedUser);
      localStorage.setItem("currentUser", JSON.stringify(savedUser));
      navigate(-1);
    } catch (err) {
      alert("Failed to update profile: " + (err as Error).message);
    }
  };

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="form-input"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Graduation Year:
            <input
              type="text"
              value={graduationYear}
              onChange={e => setGraduationYear(e.target.value)}
              placeholder="e.g. 2024"
              className="form-input"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            LinkedIn URL:
            <input
              type="url"
              value={linkedinUrl}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="form-input"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Personal Website:
            <input
              type="url"
              value={personalWebsite}
              onChange={e => setPersonalWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="form-input"
            />
          </label>
        </div>

        {/* Badge Management Section */}
        <div className="form-group">
          <label>Badges:</label>
          
          {/* Existing Badges */}
          <div className="badges-list">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <div key={`${badge.organizationName}-${index}`} className="badge-item">
                  <span className={`badge ${badge.validated ? 'validated' : 'unvalidated'}`}>
                    {badge.organizationName}
                    <span className="validation-indicator">
                      {badge.validated ? ' ✓' : ' ⚠'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(badge.organizationName)}
                    disabled={removingBadges.has(badge.organizationName)}
                    className="remove-badge-btn"
                  >
                    {removingBadges.has(badge.organizationName) ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-badges">No badges yet. Add your first badge below!</p>
            )}
          </div>

          {/* Add New Badge */}
          <div className="add-badge-section">
            <div className="add-badge-form">
              <input
                type="email"
                value={newBadgeEmail}
                onChange={e => setNewBadgeEmail(e.target.value)}
                placeholder="Enter your organizational email (e.g., user@amazon.com)"
                className="badge-input"
                disabled={addingBadge}
              />
              <button
                type="button"
                onClick={handleAddBadge}
                disabled={addingBadge || !newBadgeEmail.trim()}
                className="add-badge-btn"
              >
                {addingBadge ? "Adding..." : "Add Badge"}
              </button>
            </div>
            <p className="badge-help-text">
              Enter your work or school email address to add an organizational badge. 
              The badge will be verified based on your email domain.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="save-btn">Save</button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;