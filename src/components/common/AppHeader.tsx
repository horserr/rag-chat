import React from "react";
import {
  Typography,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "RAG Assistant",
  subtitle = "Evaluation Platform"
}) => {
  const theme = useTheme();

  return (
    <>
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
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>        <Typography
          variant="subtitle2"
          sx={{
            opacity: 0.9,
            fontWeight: 500,
            marginRight: 2,
            display: { xs: "none", sm: "block" },
          }}
        >
          {subtitle}
        </Typography>
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
    </>
  );
};

export default AppHeader;
