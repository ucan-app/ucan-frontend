import React, { JSX, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Import components
import HomePage from "./components/HomePage";
import ViewProfile from "./components/ViewProfile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ViewPost from "./components/ViewPost";
import CreatePost from "./components/CreatePost";
import { User } from "./types";

function App(): JSX.Element {
  // User state management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Authentication handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          {/* You can add a navigation component here later */}
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
                    <a href="/signup">Sign Up</a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/posts/:id" element={<ViewPost />} />
            <Route path="/profile/:id" element={<ViewProfile />} />

            {/* Protected routes */}
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

            {/* Default route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
