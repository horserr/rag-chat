import { Avatar, useTheme } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

interface MessageAvatarProps {
  sender: "user" | "bot";
}

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
  const theme = useTheme();

  return (
    <Avatar
      sx={{
        bgcolor:
          sender === "user"
            ? "rgba(67, 97, 238, 0.1)"
            : "rgba(67, 97, 238, 0.05)",
        color:
          sender === "user"
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
        marginLeft: sender === "user" ? "12px" : 0,
        marginRight: sender === "user" ? 0 : "12px",
        width: 36,
        height: 36,
      }}
    >
      {sender === "user" ? (
        <PersonOutlineOutlinedIcon fontSize="small" />
      ) : (
        <SmartToyOutlinedIcon fontSize="small" />
      )}
    </Avatar>
  );
};

export default MessageAvatar;
