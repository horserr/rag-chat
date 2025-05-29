import { AppBar, Box, Container, Toolbar } from "@mui/material";
import type { ReactNode } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";
import NavigationTabs from "../components/common/NavigationTabs";

// Main layout
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  // Determine subtitle based on current route
  const getSubtitle = () => {
    if (location.pathname === "/") {
      return "Q&A Platform";
    } else if (location.pathname.startsWith("/evaluation")) {
      return "Evaluation Platform";
    } else if (location.pathname === "/chat") {
      return "Chat Page";
    }
    return "RAG Assistant";
  };
  // Check if current page is homepage or login page
  const isHomeOrLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Only render the AppBar on pages other than home and login */}
      {!isHomeOrLoginPage ? (
        <AppBar
          position="static"
          className="gradient-primary"
          sx={{ flexShrink: 0 }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <AppHeader subtitle={getSubtitle()} />
            <NavigationTabs />
          </Toolbar>
        </AppBar>      ) : null}      <Container
        component="main"
        maxWidth={false} // 占据整个屏幕宽度，没有左右边距
        disableGutters // 移除容器的默认内边距
        sx={{
          flexGrow: 1,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: isHomeOrLoginPage ? "overlay" : "hidden", // 使用overlay让滚动条覆盖在内容上
        }}
      >
        {children}
      </Container>
      {/* Footer removed and moved to chat input area */}
    </Box>
  );
};

export default MainLayout;
