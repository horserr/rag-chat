import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NotFound } from './pages/not_found';

function PrivateRoute({ loggedIn, children }: { loggedIn: boolean; children: React.ReactNode }) {
  return loggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken ] : [string | null, any] = React.useState(localStorage.getItem("token"))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute loggedIn={token !== null} children={
          <Home setToken={setToken} token={token!}/>
          }/>} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
