import React from "react";
import {
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const NavigationTabs: React.FC = () => {
  const location = useLocation();

  // Determine the current tab based on the path
  let currentTab: string | false = false;
  if (location.pathname === "/") {
    currentTab = "/";
  } else if (location.pathname.startsWith("/evaluation")) {
    currentTab = "/evaluation";
  }

  return (
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
  );
};

export default NavigationTabs;
