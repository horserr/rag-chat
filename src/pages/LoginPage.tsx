import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Paper,
  Avatar,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthService } from '../services/auth_service';
import { TokenService } from '../services/token_service';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await authService.login({
        email,
        password
      });

      if (result.status_code === 200 && result.data) {
        // Store token with expiration time
        TokenService.setToken(result.data);

        // Navigate to chat page
        navigate('/chat');
      } else {
        // Handle failed login
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleHomeClick}
        >
          <Avatar
            src="/icon.png"
            alt="Logo"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            RAG Chat
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item xs={12} md={6} lg={5}>
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
                  <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue to the RAG Chat Platform
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleLogin} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(error)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(error)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
                      {error}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 1,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      position: 'relative'
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: theme.palette.primary.contrastText,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Feature Column - Visible on medium screens and larger */}
          <Grid
            item
            md={6}
            lg={5}
            sx={{
              display: { xs: 'none', md: 'block' }
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                elevation={0}
                sx={{
                  bgcolor: 'transparent',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    component="h2"
                    color="primary"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Enhance Your QA Experience
                  </Typography>

                  <Typography variant="body1" color="text.secondary" paragraph>
                    Get access to our advanced retrieval-augmented generation platform
                    for more accurate and contextually relevant answers.
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    {[
                      "Access to intelligent document retrieval",
                      "Context-aware responses powered by LLMs",
                      "Performance evaluation and comparison tools",
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            bgcolor: `${theme.palette.primary.main}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary"
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                        <Typography variant="body1">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 NJU RAG Platform
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
