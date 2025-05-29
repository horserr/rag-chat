import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Paper, Grid, Avatar,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TokenService } from '../services/token_service';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = TokenService.getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleEvalClick = () => {
    navigate('/evaluation');
  };  return (
    <Box
      className="home-page" // 添加类名以应用自定义滚动条样式
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'overlay', // 使用overlay让滚动条覆盖在内容上，更加美观
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src="/icon.png"
            alt="Logo"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            RAG Chat
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button
                variant="text"
                color="primary"
                onClick={handleChatClick}
              >
                Chat
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEvalClick}
              >
                Evaluation
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Grid container spacing={6} alignItems="center" sx={{ py: 8 }}>
          {/* Left Column - Text Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                NJU RAG Q&A Platform
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                An advanced question-answering system powered by Retrieval Augmented Generation.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Our platform combines the power of large language models with precise information
                retrieval, enabling accurate and context-aware responses to your questions.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  borderRadius: 2,
                }}
              >
                {isLoggedIn ? 'Go to Chat' : 'Get Started'}
              </Button>
            </motion.div>
          </Grid>

          {/* Right Column - Illustration */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: '100%',
                  minHeight: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: `linear-gradient(45deg, ${theme.palette.primary.light}22, ${theme.palette.primary.main}33)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Sample Chat Interface */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {/* Message Bubbles Simulation */}
                  {[1, 2, 3].map((index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        ml: index % 2 === 0 ? 'auto' : 0,
                        mr: index % 2 === 0 ? 0 : 'auto',
                        maxWidth: '80%',
                        borderRadius: 2,
                        bgcolor: index % 2 === 0 ? 'primary.main' : 'background.paper',
                        color: index % 2 === 0 ? 'primary.contrastText' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">
                        {index % 2 === 0
                          ? "How can RAG improve response quality?"
                          : "RAG enhances responses by retrieving relevant context from trustworthy sources before generating answers, resulting in more accurate, factual, and contextually appropriate responses."}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: `radial-gradient(${theme.palette.primary.main}33, ${theme.palette.primary.light}22)`,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `radial-gradient(${theme.palette.primary.main}33, ${theme.palette.primary.light}22)`,
                    zIndex: 0,
                  }}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {[
              {
                title: "Accurate Answers",
                description: "Get precise responses enhanced by retrieving relevant documents.",
              },
              {
                title: "Source Attribution",
                description: "Know exactly where information comes from with transparent sourcing.",
              },
              {
                title: "Performance Evaluation",
                description: "Evaluate and compare different RAG configurations.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index + 0.5 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
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

export default HomePage;
