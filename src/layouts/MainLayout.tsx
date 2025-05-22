import React from "react";
import type { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Avatar,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// Main layout
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();

  // Determine the current tab based on the path
  let currentTab: string | false = false;
  if (location.pathname === "/") {
    currentTab = "/";
  } else if (location.pathname.startsWith("/evaluation")) {
    currentTab = "/evaluation";
  }

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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src="/icon.png"
              alt="RAG Assistant Icon"
              className="icon-hover"
              sx={{
                width: 38,
                height: 38,
                marginRight: 1.5,
                borderRadius: "50%",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                fontSize: "1.3rem",
              }}
            >
              RAG Assistant
            </Typography>
          </Box>

          {/* Centered Tabs */}
          <Tabs
            value={currentTab}
            indicatorColor="primary"
            textColor="primary"
            aria-label="navigation tabs"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1, // Ensure tabs are visible above other elements
              "& .MuiTab-root": {
                minHeight: "64px",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "white",
              },
              "& .Mui-selected": {
                color: "white",
                opacity: 1,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "white",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ChatIcon
                    sx={{ marginRight: 1, fontSize: "1.2rem", color: "white" }}
                  />
                  <Box component="span" sx={{ color: "white" }}>
                    Chat
                  </Box>
                </Box>
              }
              value="/"
              to="/"
              component={Link}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AnalyticsIcon
                    sx={{ marginRight: 1, fontSize: "1.2rem", color: "white" }}
                  />
                  <Box component="span" sx={{ color: "white" }}>
                    Evaluation
                  </Box>
                </Box>
              }
              value="/evaluation"
              to="/evaluation"
              component={Link}
            />
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="subtitle2"
              sx={{
                opacity: 0.9,
                fontWeight: 500,
                marginRight: 2,
                display: { xs: "none", sm: "block" },
              }}
            >
              Evaluation Platform
            </Typography>{" "}
            <Avatar
              className="icon-hover"
              sx={{
                backgroundColor: "white",
                color: theme.palette.primary.main,
                width: 38,
                height: 38,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              AI
            </Avatar>
          </Box>
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
