import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import type { ReactNode } from "react";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface CreationLayoutProps {
  children: ReactNode;
  title: string;
  titleColor: string;
  onClose: () => void;
  backgroundGradient?: string;
}

/**
 * CreationLayout - 专用于创建流程的布局组件
 * 简化的标题栏，仅包含标题和关闭按钮，没有导航按钮
 */
const CreationLayout: React.FC<CreationLayoutProps> = ({
  children,
  title,
  titleColor,
  onClose,
  backgroundGradient,
}) => {
  // 构建背景渐变色，如果没有提供则使用默认值
  const background = backgroundGradient || `linear-gradient(135deg, ${titleColor}80, ${titleColor}40)`;

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
      <AppBar
        position="static"
        sx={{
          flexShrink: 0,
          background: background,
          boxShadow: 1,
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
            sx={{ display: "flex", alignItems: "center" }}
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
                color: titleColor,
              }}
            >
              {title}
            </Typography>
          </Box>

          <IconButton onClick={onClose} sx={{ color: titleColor }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          flexGrow: 1,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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

export default CreationLayout;
