import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from './pages/home';
import { Login } from './pages/login';
import NotFound from './pages/not_found';
import { TokenService } from './services/token_service';

function PrivateRoute({ loggedIn, children }: { loggedIn: boolean; children: React.ReactNode }) {
  return loggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // Initialize token state from TokenService instead of directly from localStorage
  const [token, setToken] = React.useState<string | null>(TokenService.getToken());

  // Custom token setter that updates both state and TokenService
  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      // Store token with expiration
      TokenService.setToken(newToken);
    } else {
      // Clear token on logout
      TokenService.clearToken();
    }
    // Update state
    setToken(newToken);
  };

  // Check token validity periodically
  useEffect(() => {
    // Check token validity every minute
    const tokenCheckInterval = setInterval(() => {
      // This will return null if the token is expired
      const validToken = TokenService.getToken();

      // If token state is not null but valid token is null, update state
      if (token && !validToken) {
        setToken(null);
      }
    }, 60000); // Check every minute

    // Cleanup interval on component unmount
    return () => clearInterval(tokenCheckInterval);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute loggedIn={token !== null} children={
            <Home setToken={handleSetToken} token={token || ''}/>
          }/>
        } />
        <Route path="/login" element={<Login setToken={handleSetToken}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
