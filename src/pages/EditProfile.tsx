import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, User } from "../types";
import { updateProfile, addBadge, removeBadge, getProfile } from "../api";
import { uploadProfilePicture, getProfilePictureUrl } from "../api/image"; 
import ImageUpload from "../components/ImageUpload"; 
import "./EditProfile.css";

type EditProfileProps = {
  user: User | null;
  onSave: (updatedUser: User) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialUser: User | null = user || (location.state && location.state.user);

  const [bio, setBio] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedinUrl, setLinkedin] = useState("");
  const [personalWebsite, setPersonalWebsite] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadgeEmail, setNewBadgeEmail] = useState("");
  const [addingBadge, setAddingBadge] = useState(false);
  const [removingBadges, setRemovingBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false); 
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null); 
  const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState<string | null>(null); 

  // Initialize form data when user data is available
  useEffect(() => {
    const initializeForm = async () => {
      if (!initialUser) return;
      
      try {
        setLoading(true);
        // Fetch the latest user data to ensure we have current badges
        const latestUserData = await getProfile(initialUser.userId);
        
        // Initialize all form fields with latest data
        setBio(latestUserData.bio || "");
        setGraduationYear(latestUserData.graduationYear?.toString() || "");
        setLinkedin(latestUserData.linkedinUrl || "");
        setPersonalWebsite(latestUserData.personalWebsite || "");
        setBadges(latestUserData.badges || []);
        
        // Fetch current profile picture separately
        try {
          const profilePictureUrl = await getProfilePictureUrl(latestUserData.userId.toString());
          setCurrentProfilePictureUrl(profilePictureUrl);
          console.log("Current profile picture URL:", profilePictureUrl);
        } catch (error) {
          console.log("No profile picture found, which is normal for new users");
          setCurrentProfilePictureUrl(null);
        }

        console.log("Form initialized with latest user data:", latestUserData);
        console.log("Initial badges:", latestUserData.badges);
      } catch (error) {
        console.error("Failed to fetch latest user data:", error);
        // Fallback to props data if API call fails
        setBio(initialUser.bio || "");
        setGraduationYear(initialUser.graduationYear?.toString() || "");
        setLinkedin(initialUser.linkedinUrl || "");
        setPersonalWebsite(initialUser.personalWebsite || "");
        setBadges(initialUser.badges || []);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [initialUser]);

  if (!initialUser) {
    return <p>No user data available.</p>;
  }

  if (loading) {
    return <p>Loading profile data...</p>;
  }

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeEmail.trim()) return;

    // Validate email format
    if (!validateEmail(newBadgeEmail.trim())) {
      alert("Please enter a valid email address (e.g., user@amazon.com)");
      return;
    }

    setAddingBadge(true);
    try {
      console.log("Adding badge with email:", newBadgeEmail.trim());
      
      await addBadge(newBadgeEmail.trim());
      
      // Refresh user profile to get updated badges AND update all form state
      console.log("Fetching updated profile for userId:", initialUser.userId);
      const updatedUserData = await getProfile(initialUser.userId);
      console.log("Updated user data:", updatedUserData);
      console.log("Updated badges:", updatedUserData.badges);
      
      // Update ALL form state with fresh data from the server
      setBadges(updatedUserData.badges || []);
      setBio(updatedUserData.bio || "");
      setGraduationYear(updatedUserData.graduationYear?.toString() || "");
      setLinkedin(updatedUserData.linkedinUrl || "");
      setPersonalWebsite(updatedUserData.personalWebsite || "");
      
      setNewBadgeEmail("");
      
      console.log("Badge added and form state refreshed successfully");
    } catch (error) {
      console.error("Failed to add badge:", error);
      alert("Failed to add badge. Please make sure you're using a valid organizational email address.");
    } finally {
      setAddingBadge(false);
    }
  };

  const handleRemoveBadge = async (organizationName: string) => {
    console.log("Attempting to remove badge:", organizationName);
    
    setRemovingBadges(prev => new Set(prev).add(organizationName));
    
    try {
      await removeBadge(organizationName);
      
      // Refresh the entire profile to ensure consistency
      const updatedUserData = await getProfile(initialUser.userId);
      console.log("Profile refreshed after badge removal:", updatedUserData);
      
      // Update ALL form state with fresh data from the server
      setBadges(updatedUserData.badges || []);
      setBio(updatedUserData.bio || "");
      setGraduationYear(updatedUserData.graduationYear?.toString() || "");
      setLinkedin(updatedUserData.linkedinUrl || "");
      setPersonalWebsite(updatedUserData.personalWebsite || "");
      
      console.log("Badge removed and form state refreshed successfully");
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
  
  /*const handleProfilePictureSelect = (file: File) => {
    setSelectedProfilePicture(file);
  };

  const handleProfilePictureRemove = () => {
    setSelectedProfilePicture(null);
  };
*/
  /*const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Send only the fields that UserProfileDTO expects
  const minimalProfileData = {
    userId: initialUser.userId,
    fullName: initialUser.fullName,
    linkedinUrl: linkedinUrl || "",
    personalWebsite: personalWebsite || "",
    bio: bio || "",
    graduationYear: parseInt(graduationYear, 10) || 0
  };
  
  console.log("Sending minimal profile data:", minimalProfileData);
  
  try {
    const result = await updateProfile(minimalProfileData);
    console.log("Update result:", result);
    
    // Get fresh complete profile
    const freshProfile = await getProfile(initialUser.userId);
    onSave(freshProfile);
    localStorage.setItem("currentUser", JSON.stringify(freshProfile));
    
    navigate(-1);
  } catch (error: any) {
    console.error("Update failed:", error);
    console.error("Response data:", error.response?.data);
    alert("Update failed: " + (error.response?.data?.message || error.message));
  }
};*/
/*
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Handle profile picture upload SEPARATELY if user selected one
    if (selectedProfilePicture) {
      setUploadingProfilePicture(true);
      console.log("Uploading profile picture...");
      try {
        const imageUrl = await uploadProfilePicture(selectedProfilePicture);
        console.log("Profile picture uploaded successfully:", imageUrl);
        // Update the current display URL
        setCurrentProfilePictureUrl(imageUrl);
      } catch (error) {
        console.error("Profile picture upload failed:", error);
        alert("Failed to upload profile picture. Please try again.");
        setUploadingProfilePicture(false);
        return; // Don't proceed with profile update if image upload fails
      } finally {
        setUploadingProfilePicture(false);
      }
    }
    
    // Parse graduation year properly - only include if it's a valid number
    let parsedGraduationYear: number | undefined;
    if (graduationYear.trim() && !isNaN(parseInt(graduationYear, 10))) {
      parsedGraduationYear = parseInt(graduationYear, 10);
    }
    
    // Send only the profile fields (NO image data here)
    const minimalProfileData: any = {
      userId: initialUser.userId,
      fullName: initialUser.fullName,
      linkedinUrl: linkedinUrl || "",
      personalWebsite: personalWebsite || "",
      bio: bio || "",
    };
    
    // Only include graduationYear if it has a valid value
    if (parsedGraduationYear !== undefined) {
      minimalProfileData.graduationYear = parsedGraduationYear;
    }
    
    console.log("Sending minimal profile data:", minimalProfileData);
    
    const result = await updateProfile(minimalProfileData);
    console.log("Update result:", result);
    
    // Get fresh complete profile (this will include the updated image if uploaded)
    const freshProfile = await getProfile(initialUser.userId);
    onSave(freshProfile);
    localStorage.setItem("currentUser", JSON.stringify(freshProfile));
    
    navigate(-1);
    } catch (error: any) {
      console.error("Update failed:", error);
      console.error("Response data:", error.response?.data);
      alert("Update failed: " + (error.response?.data?.message || error.message));
    }
  };
*/
// Simple debugging for EditProfile - just add these console.logs:

const handleProfilePictureSelect = (file: File) => {
  console.log("File selected:", file.name, file.size);
  setSelectedProfilePicture(file);
};
const handleProfilePictureRemove = () => {
    console.log("File removed:");
    setSelectedProfilePicture(null);
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log("Submit started, selected file:", selectedProfilePicture?.name || "none");
  
  try {
    // Handle profile picture upload
    if (selectedProfilePicture) {
      console.log("Starting upload...");
      setUploadingProfilePicture(true);
      
      try {
        const imageUrl = await uploadProfilePicture(selectedProfilePicture);
        console.log("Upload success:", imageUrl);
        setCurrentProfilePictureUrl(imageUrl);
      } catch (error) {
        console.log("Upload failed:", error);
        alert("Failed to upload profile picture: " + error);
        setUploadingProfilePicture(false);
        return;
      } finally {
        setUploadingProfilePicture(false);
      }
    }
    
    // Profile update code (unchanged)
    let parsedGraduationYear: number | undefined;
    if (graduationYear.trim() && !isNaN(parseInt(graduationYear, 10))) {
      parsedGraduationYear = parseInt(graduationYear, 10);
    }
    
    const minimalProfileData: any = {
      userId: initialUser.userId,
      fullName: initialUser.fullName,
      linkedinUrl: linkedinUrl || "",
      personalWebsite: personalWebsite || "",
      bio: bio || "",
    };
    
    if (parsedGraduationYear !== undefined) {
      minimalProfileData.graduationYear = parsedGraduationYear;
    }
    
    console.log("Updating profile...");
    const result = await updateProfile(minimalProfileData);
    console.log("Profile updated");
    
    const freshProfile = await getProfile(initialUser.userId);
    onSave(freshProfile);
    localStorage.setItem("currentUser", JSON.stringify(freshProfile));
    
    navigate(-1);
  } catch (error: any) {
    console.log("Submit error:", error.message);
    alert("Update failed: " + (error.response?.data?.message || error.message));
  }
};

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label>Profile Picture:</label>
        <ImageUpload
          onImageSelect={handleProfilePictureSelect}
          onImageRemove={handleProfilePictureRemove}
          currentImageUrl={currentProfilePictureUrl || undefined}
          isUploading={uploadingProfilePicture}
          className="profile-picture-upload"
          label="Upload Profile Picture"
          showPreview={true}
        />
      </div>
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
          <label>Organization Badges:</label>
          
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
              <p className="no-badges">No badges yet. Add your first organizational badge below!</p>
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
          <button type="submit" className="save-btn" disabled={uploadingProfilePicture}>
            {uploadingProfilePicture ? "Uploading Image..." : "Save Profile"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="cancel-btn"
            disabled={uploadingProfilePicture}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;