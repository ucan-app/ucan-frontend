import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onLogin(username, password);
      // If login is successful, redirect to home page
      navigate('/');
    } catch (error: any) {
      // Handle the error and display the message
      setErrorMessage(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && (
        <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;