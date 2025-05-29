import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoggedIn }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>      <Grid container spacing={6} alignItems="center" sx={{ py: 8 }}>
        {/* Left Column - Text Content */}
        <Grid size={{ xs: 12, md: 6 }}>
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
        </Grid>        {/* Right Column - Illustration */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                        : "RAG combines retrieval with generation to provide more accurate, contextual responses backed by relevant documents."
                      }
                    </Typography>
                  </Paper>
                ))}
              </Box>

              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}33, transparent)`,
                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HeroSection;
