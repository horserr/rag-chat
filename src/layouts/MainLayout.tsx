import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import type { ReactNode } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AssessmentIcon from "@mui/icons-material/Assessment";

// Main layout
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Check if current page is homepage or login page
  const isHomeOrLoginPage =
    location.pathname === "/" || location.pathname === "/login";

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
              px: 4,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => location.pathname !== "/" && navigate("/")}
            >
              <Avatar
                src="/icon.png"
                alt="Logo"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                {location.pathname.includes("evaluation")
                  ? "RAG Evaluation"
                  : "RAG Chat"}
              </Typography>
            </Box>            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color="inherit"
                variant={
                  location.pathname.includes("/chat") ? "outlined" : "text"
                }
                onClick={() => navigate("/chat")}
                startIcon={<ChatIcon />}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  "&:focus-visible": {
                    outline: "2px solid white",
                    outlineOffset: "2px",
                  },
                  "&:active": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              >
                Chat
              </Button>
              <Button
                color="inherit"
                variant={
                  location.pathname.includes("/evaluation")
                    ? "outlined"
                    : "text"
                }
                onClick={() => navigate("/evaluation")}
                startIcon={<AssessmentIcon />}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  "&:focus-visible": {
                    outline: "2px solid white",
                    outlineOffset: "2px",
                  },
                  "&:active": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              >
                Evaluation
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      ) : null}
      <Container
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
