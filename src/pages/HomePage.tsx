import { Box } from "@mui/material";
import { FeaturesSection, HeroSection, HomeFooter, HomeHeader } from "../components/home";
import { useAuthCheck } from "../hooks/auth";

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
