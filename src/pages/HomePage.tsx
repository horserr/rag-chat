import React from 'react';
import { Box } from '@mui/material';
import { useAuthCheck } from '../hooks/useAuth';
import HomeHeader from '../components/home/HomeHeader';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HomeFooter from '../components/home/HomeFooter';

const HomePage: React.FC = () => {
  const { data: authData } = useAuthCheck();
  const isLoggedIn = authData?.isLoggedIn || false;return (
    <Box
      className="home-page"
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'overlay',
      }}
    >
      <HomeHeader isLoggedIn={isLoggedIn} />

      <HeroSection isLoggedIn={isLoggedIn} />

      <FeaturesSection />

      <HomeFooter />
    </Box>
  );
};

export default HomePage;
