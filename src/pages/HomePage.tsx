import { Box } from "@mui/material";
import FeaturesSection from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import HomeFooter from "../components/home/HomeFooter";
import HomeHeader from "../components/home/HomeHeader";
import useAuthCheck from "../hooks/auth/useAuthCheck";

const HomePage = () => {
  const { data: isLoggedIn } = useAuthCheck();
  return (
    <Box
      className="home-page"
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        overflowY: "overlay",
      }}
    >
      <HomeHeader isLoggedIn={!!isLoggedIn} />

      <HeroSection isLoggedIn={!!isLoggedIn} />

      <FeaturesSection />

      <HomeFooter />
    </Box>
  );
};

export default HomePage;
