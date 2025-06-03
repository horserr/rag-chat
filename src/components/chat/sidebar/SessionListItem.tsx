import React from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  IconButton,
  useTheme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface SessionData {
  id: number;
  title?: string;
  active_at: string;
}

interface SessionListItemProps {
  session: SessionData;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number, event: React.MouseEvent) => void;
}

const SessionListItem = ({
  session,
  isSelected,
  onSelect,
  onDelete,
}: SessionListItemProps) => {
  const theme = useTheme();

  return (
    <ListItem
      key={session.id}
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          size="small"
          onClick={(e) => onDelete(session.id, e)}
          sx={{ opacity: 0.7 }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      }
      sx={{ mb: 1 }}
    >
      <Button
        fullWidth
        onClick={() => onSelect(session.id)}
        sx={{
          justifyContent: "flex-start",
          textAlign: "left",
          py: 1.5,
          px: 2,
          borderRadius: "10px",
          backgroundColor: isSelected
            ? "rgba(67, 97, 238, 0.08)"
            : "transparent",
          "&:hover": {
            backgroundColor: "rgba(67, 97, 238, 0.12)",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
          color: theme.palette.text.primary,
        }}
      >
        <Box sx={{ width: "100%", pr: 4 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: isSelected ? 600 : 400,
              mb: 0.5,
              color: isSelected ? theme.palette.primary.main : "inherit",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {session.title || "New Chat"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              display: "flex",
              alignItems: "center",
            }}
          >
            {new Date(session.active_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Button>
    </ListItem>
  );
};

export default SessionListItem;
