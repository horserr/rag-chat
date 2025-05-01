import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NotFound } from './pages/not_found';
import HistoryPanel from "./components/HistoryPanel/HistoryPanel"; // 导入历史记录面板组件
import ChatPanel from "./components/ChatPanel/ChatPanel"; // 导入聊天面板组件
import styles from "@styles/pages/App.module.scss"; // 导入 CSS Modules

function PrivateRoute({ loggedIn , children }) {
  return loggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken ] : [string | null, any] = React.useState(localStorage.getItem("token"))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute loggedIn={token !== null} children={
          // <Home setToken={setToken}/>
          <div className={styles.App}>
          <HistoryPanel />
          <ChatPanel />
         </div>
          }/>} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
