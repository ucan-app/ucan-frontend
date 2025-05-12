import React, { JSX, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { login, getCurrentUser, logout } from "./api/auth"; // Import API functions

// Import components
import HomePage from "./components/HomePage";
import ViewProfile from "./components/ViewProfile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ViewPost from "./components/ViewPost";
import CreatePost from "./components/CreatePost";
import { User } from "./types";

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Fetch the current user on app load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Authentication handlers
  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
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
                    <a href="/login">Login</a> {/* Add Login link */}
                  </li>
                  <li>
                    <a href="/signup">Sign Up</a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
  
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/posts/:id" element={<ViewPost />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route
              path="/create"
              element={
                isLoggedIn ? (
                  <CreatePost user={currentUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;