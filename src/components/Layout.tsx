import React from "react";
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
}) => (
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
                <button onClick={handleLogout}>Logout</button>
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

export default Layout;
