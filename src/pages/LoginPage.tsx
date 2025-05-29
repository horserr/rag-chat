import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import LoginHeader from '../components/login/LoginHeader';
import LoginForm from '../components/login/LoginForm';
import LoginFeatures from '../components/login/LoginFeatures';
import LoginFooter from '../components/login/LoginFooter';

const LoginPage: React.FC = () => {
  const theme = useTheme();  return (
    <Box
      className="login-page"
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflowY: 'overlay',
      }}
    >
      <LoginHeader />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
                }}
              >
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue to the RAG Chat Platform
                  </Typography>
                </Box>

                <LoginForm />
              </Paper>
            </motion.div>
          </Grid>

          {/* Feature Column - Visible on medium screens and larger */}
          <Grid
            size={{ md: 6, lg: 5 }}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <LoginFeatures />
          </Grid>
        </Grid>
      </Box>

      <LoginFooter />
    </Box>
  );
};

export default LoginPage;
