import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";

interface SidebarHeaderProps {
  onNewSession: () => void;
}

const SidebarHeader = ({ onNewSession }: SidebarHeaderProps) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <HistoryIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: "1.05rem",
              color: theme.palette.text.primary,
            }}
          >
            Chat History
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onNewSession}
          startIcon={<AddIcon />}
        >
          New
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};

export default SidebarHeader;
