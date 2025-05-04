import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import components
import HomePage from './components/FrontPage';
import ViewProfile from './components/ViewProfile';
import Login from './components/Login';
import EditProfile from './components/EditProfile';
import CreateProfile from './components/CreateProfile';
import AddBadge from './components/AddBadge';
import Authentication from './components/Authentication';
import ViewPost from './components/ViewPost';
import CreatePost from './components/CreatePost';
import SearchResult from './components/SearchResult';


// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  badges: Badge[];
  // Add other user properties as needed
}

// Define Badge interface
interface Badge {
  id: string;
  type: 'UW' | 'COMPANY';
  label: string;
  verifiedDomain: string;
}

function App(): JSX.Element {
  // Basic user state that you can expand later
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Simple login/logout functions without token handling
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
        <NavigationBar 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            {/* All routes accessible whether logged in or not */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<CreateProfile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/badge" element={<AddBadge />} />
            <Route path="/posts/:id" element={<ViewPost />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/auth/verify" element={<Authentication />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;