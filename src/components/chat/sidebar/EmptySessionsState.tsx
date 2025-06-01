import { Box, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

const EmptySessionsState = () => {
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <HistoryIcon fontSize="small" sx={{ color: "text.secondary" }} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
        No History Yet
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", textAlign: "center", px: 2 }}
      >
        Your conversations will appear here
      </Typography>
    </Box>
  );
};

export default EmptySessionsState;
