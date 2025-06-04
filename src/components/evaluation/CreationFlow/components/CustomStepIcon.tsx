import React from "react";
import { Box, useTheme } from "@mui/material";
import type { StepIconProps } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CreateIcon from "@mui/icons-material/Create";
import DatasetIcon from "@mui/icons-material/Dataset";

const CustomStepIcon: React.FC<StepIconProps> = (props) => {
  const { active, completed, icon } = props;
  const theme = useTheme();

  const icons: { [index: string]: React.ReactElement } = {
    1: <CreateIcon fontSize="small" />,
    2: <DatasetIcon fontSize="small" />,
    3: <CheckCircleOutlineIcon fontSize="small" />,
  };

  return (
    <Box
      sx={{
        backgroundColor: completed
          ? theme.palette.primary.main
          : active
          ? theme.palette.primary.light
          : theme.palette.grey[200],
        color: completed || active ? "#fff" : theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 36,
        height: 36,
        transition: "all 0.3s",
      }}
    >
      {icons[String(icon)]}
    </Box>
  );
};

export default CustomStepIcon;
