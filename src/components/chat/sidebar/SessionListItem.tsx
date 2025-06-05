import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  IconButton,
  useTheme,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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
  onRename?: (id: number, newTitle: string) => void;
}

const SessionListItem = ({
  session,
  isSelected,
  onSelect,
  onDelete,
  onRename,
}: SessionListItemProps) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title || "New Chat");

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(session.title || "New Chat");
  };

  const handleConfirmRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRename && editTitle.trim()) {
      onRename(session.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(session.title || "New Chat");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter" && onRename && editTitle.trim()) {
      onRename(session.id, editTitle.trim());
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(session.title || "New Chat");
    }
  };

  return (
    <ListItem
      key={session.id}
      disablePadding
      secondaryAction={
        isEditing ? (
          <Box sx={{ display: "flex" }}>
            <IconButton
              edge="end"
              size="small"
              onClick={handleConfirmRename}
              sx={{ opacity: 0.7 }}
              title="保存"
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton
              edge="end"
              size="small"
              onClick={handleCancelRename}
              sx={{ opacity: 0.7 }}
              title="取消"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            {onRename && (
              <IconButton
                edge="end"
                size="small"
                onClick={handleStartEditing}
                sx={{ opacity: 0.7 }}
                title="重命名"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => onDelete(session.id, e)}
              sx={{ opacity: 0.7 }}
              title="删除"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )
      }
      sx={{ mb: 1 }}
    >
      {isEditing ? (
        <TextField
          fullWidth
          size="small"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          variant="outlined"
          sx={{
            ml: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "rgba(67, 97, 238, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(67, 97, 238, 0.08)",
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(67, 97, 238, 0.12)",
              },
            },
          }}
        />
      ) : (
        <Button
          fullWidth
          onClick={() => onSelect(session.id)}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            py: 1.5,
            px: 2,
            borderRadius: "10px",
            backgroundColor:
              isSelected ? "rgba(67, 97, 238, 0.08)" : "transparent",
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
          <Box sx={{ width: "100%", pr: 8 }}>
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
      )}
    </ListItem>
  );
};

export default SessionListItem;
