import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { User } from "../types";

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
  children
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogoutAndRedirect = () => {
    handleLogout(); // Call the provided logout function
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="app-container">
      <header>
        <nav className="main-nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
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
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;