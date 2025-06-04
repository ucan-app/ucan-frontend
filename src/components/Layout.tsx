import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import ProfilePictureDisplay from "../components/ProfilePictureDisplay";
import "./Layout.css";

interface LayoutProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
  currentUser: User | null;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  isLoggedIn,
  handleLogout,
  currentUser,
  children,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  // Real-time search effect
  useEffect(() => {
    const searchResults = document.querySelectorAll('.post-preview');
    const query = searchQuery.toLowerCase().trim();
    
    searchResults.forEach((post) => {
      // Get all searchable content
      const title = post.querySelector('.post-title')?.textContent?.toLowerCase() || '';
      const content = post.querySelector('.post-content')?.textContent?.toLowerCase() || '';
      const author = post.querySelector('.post-author')?.textContent?.toLowerCase() || '';
      
      // Show post if query is empty or if any of the content matches
      if (query === '' || 
          title.includes(query) || 
          content.includes(query) || 
          author.includes(query)) {
        (post as HTMLElement).style.display = 'block';
      } else {
        (post as HTMLElement).style.display = 'none';
      }
    });
  }, [searchQuery]); // Re-run effect whenever searchQuery changes

  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav-bar">
          <a href="/" className="logo">
            UCAN
          </a>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts, content, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-button">🔍</span>
          </div>
          <div className="user-menu">
            <button className="user-icon">
              {isLoggedIn && currentUser ? (
                <ProfilePictureDisplay
                  userId={currentUser.userId}
                  userName={currentUser.fullName}
                  size="small"
                  className="header-profile-picture"
                />
              ) : (
                <img
                  src="/profile_icon.png"
                  alt="User"
                  className="user-icon-image"
                />
              )}
            </button>
            <ul className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  <li>
                    <a href="/profile">Profile</a>
                  </li>
                  <li>
                    <a href="/create">Create Post</a>
                  </li>
                  <li>
                    <button onClick={handleLogoutAndRedirect}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/login">Login</a>
                  </li>
                  <li>
                    <a href="/signup">Sign Up</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;