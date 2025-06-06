import React from "react";
import { Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import PageHeader from "../components/common/PageHeader";
import LoginFeatures from "../components/login/LoginFeatures";
import LoginFooter from "../components/login/LoginFooter";
import AuthContainer from "../components/login/AuthContainer";

const LoginPage: React.FC = () => {
  return (
    <Box
      className="login-page"
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflowY: "overlay",
      }}
    >
      <PageHeader title="RAG Assistant" />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuthContainer />
            </motion.div>
          </Grid>

          {/* Feature Column - Visible on medium screens and larger */}
          <Grid
            size={{ md: 6, lg: 5 }}
            sx={{
              display: { xs: "none", md: "block" },
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
