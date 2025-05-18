import React from 'react';
import type { ReactNode } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Tabs, Tab, Paper,
  Avatar, IconButton, useTheme
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// Main layout
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();

  // Determine the current tab based on the path
  let currentTab: string | false = false;
  if (location.pathname === '/') {
    currentTab = '/';
  } else if (location.pathname.startsWith('/evaluation')) {
    currentTab = '/evaluation';
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <AppBar position="static" className="gradient-primary" sx={{ flexShrink: 0 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                width: 38,
                height: 38,
                marginRight: 1.5,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              AI
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontSize: '1.3rem'
              }}
            >
              RAG Assistant
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Evaluation Platform
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={0}
        sx={{
          flexShrink: 0,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: 'white'
        }}
      >
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          aria-label="navigation tabs"
          centered
          sx={{
            '& .MuiTab-root': {
              minHeight: '56px',
              fontWeight: 600,
              fontSize: '0.95rem',
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Chat
              </Box>
            }
            value="/"
            to="/"
            component={Link}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AnalyticsIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Evaluation
              </Box>
            }
            value="/evaluation"
            to="/evaluation"
            component={Link}
          />
        </Tabs>
      </Paper>
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {children}      </Container>
      <Box
        component="footer"
        className="gradient-light"
        sx={{
          padding: '12px',
          textAlign: 'center',
          flexShrink: 0,
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
          © {new Date().getFullYear()} RAG Assistant Platform
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
