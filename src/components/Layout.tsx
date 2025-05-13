import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
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

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav-bar">
          <a href="/" className="logo">
            UCAN
          </a>
          <div className="user-menu">
            <button className="user-icon">
              <img
                src="/profile_icon.png"
                alt="User"
                className="user-icon-image"
              />
            </button>
            <ul className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  <li>
                    <a href="/profile">Profile</a>
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