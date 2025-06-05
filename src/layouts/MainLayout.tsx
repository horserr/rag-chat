import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import type { ReactNode } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloseIcon from "@mui/icons-material/Close";

// Main layout
interface MainLayoutProps {
  children: ReactNode;
  customTitle?: string;
  customTitleColor?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  hideNavButtons?: boolean;
  headerBackground?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  customTitle,
  customTitleColor,
  showCloseButton = false,
  onClose,
  hideNavButtons = false,
  headerBackground,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Check if current page is homepage or login page
  const isHomeOrLoginPage =
    location.pathname === "/" || location.pathname === "/login";

  // Determine title to show
  const pageTitle = customTitle || (location.pathname.includes("evaluation")
    ? "RAG Evaluation"
    : "RAG Chat");

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
          className={!headerBackground ? "gradient-primary" : undefined}
          sx={{
            flexShrink: 0,
            background: headerBackground || undefined,
          }}
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
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: showCloseButton ? "default" : "pointer",
              }}
              onClick={showCloseButton ? undefined : () => location.pathname !== "/" && navigate("/")}
            >
              <Avatar
                src="/icon.png"
                alt="Logo"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: customTitleColor || "white"
                }}
              >
                {pageTitle}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {!hideNavButtons && (
                <>
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
                </>
              )}

              {showCloseButton && onClose && (
                <IconButton onClick={onClose} sx={{ color: customTitleColor || "white" }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      ) : null}

      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          flexGrow: 1,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: isHomeOrLoginPage ? "overlay" : "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default MainLayout;
