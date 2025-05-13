import React, { JSX, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { getProfile, login, logout } from "./api/auth"; // Import API functions
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ViewProfile from "./pages/ViewProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ViewPost from "./pages/ViewPost";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import { User } from "./types";
import { dummyUser } from "./dummyData";

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Authentication handlers
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<any> => {
    try {
      const uid: number | undefined = await login(username, password);
      if(uid === undefined) {
        throw new Error("Login failed: uid is undefined");
      }
      const user: User = await getProfile(uid);
      //const user = fakeUser; // For testing purposes, use a fake user
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        user.fullname = username; // should be username
        localStorage.setItem("currentUser", JSON.stringify(user)); // Persist user
      } else {
        throw new Error("Login failed: User is undefined");
      }
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
      localStorage.removeItem("currentUser"); // Clear persisted user
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <Layout
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        currentUser={currentUser}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:pid" element={<ViewPost />} />
          <Route path="/create" element={<CreatePost user={currentUser} />} />
          <Route path="/profile" element={<ViewProfile user={currentUser} />} />
          <Route path="/edit" element={<EditProfile user={currentUser} onSave={setCurrentUser} />} />
          {/* Redirect to home if no match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
