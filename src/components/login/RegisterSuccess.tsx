import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";

interface RegisterSuccessProps {
  onSwitchToLogin: () => void;
}

const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ onSwitchToLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircle
            sx={{
              fontSize: 64,
              color: "success.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Registration Successful!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Your account has been created successfully. You can now sign in with your credentials.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onSwitchToLogin}
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: "bold",
            }}
          >
            Sign In Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterSuccess;
