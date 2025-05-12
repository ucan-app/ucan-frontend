import React, { JSX, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { login, logout } from "./api/auth"; // Import API functions
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ViewProfile from "./pages/ViewProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ViewPost from "./pages/ViewPost";
import CreatePost from "./pages/CreatePost";
import { User } from "./types";

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Authentication handlers
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<any> => {
    try {
      const user = await login(username, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      return user; // Return the user on successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Important: Re-throw the error so it can be caught by the Login component
      throw error;
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
      <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:id" element={<ViewPost />} />
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
      </Layout>
    </Router>
  );
}

export default App;
