import React from "react";
import type { ReactNode } from "react";
import { Container, Box, AppBar, Toolbar } from "@mui/material";
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
      return "Chat Page";
    } else if (location.pathname.startsWith("/evaluation")) {
      return "Evaluation Platform";
    }
    return "RAG Assistant";
  };

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
      </AppBar>
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </Container>
      {/* Footer removed and moved to chat input area */}
    </Box>
  );
};

export default MainLayout;
