import {
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface TaskCardProps {
  task: {
    id: string | number;
    name: string;
    description?: string;
  };
  isSelected?: boolean;
  onClick: () => void;
  onHover?: () => void;
  onDelete?: (taskId: string | number) => void;
  onRename?: (taskId: string | number, newName: string) => void;
  loading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected = false,
  onClick,
  onHover,
  onDelete,
  onRename,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showRenameDialog, setShowRenameDialog] = React.useState(false);
  const [newName, setNewName] = React.useState(task.name);
  const [renameError, setRenameError] = React.useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleRenameClick = () => {
    setNewName(task.name);
    setRenameError("");
    setShowRenameDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(task.id);
    }
    setShowDeleteDialog(false);
  };

  const handleRenameConfirm = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setRenameError("任务名称不能为空");
      return;
    }
    if (trimmedName === task.name) {
      setShowRenameDialog(false);
      return;
    }
    if (onRename) {
      onRename(task.id, trimmedName);
    }
    setShowRenameDialog(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          sx={{
            cursor: "pointer",
            border: isSelected ? 2 : 1,
            borderColor: isSelected ? "primary.main" : "divider",
            "&:hover": {
              boxShadow: 2,
            },
          }}
          onClick={onClick}
          onMouseEnter={onHover}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" noWrap>
                  {task.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  ID: {task.id}
                </Typography>
                {task.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      "-webkit-line-clamp": 2,
                      "-webkit-box-orient": "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {task.description}
                  </Typography>
                )}
              </Box>
              {(onDelete || onRename) && (
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreIcon />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onRename && (
          <MenuItem onClick={handleRenameClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>重命名</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>删除</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除任务 "{task.name}" 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>取消</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={showRenameDialog}
        onClose={() => setShowRenameDialog(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>重命名任务</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="任务名称"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setRenameError("");
            }}
            error={!!renameError}
            helperText={renameError}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRenameDialog(false)}>取消</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { TaskCard };
