import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

const LoginFeatures: React.FC = () => {
  const theme = useTheme();

  const features = [
    "Access to intelligent document retrieval",
    "Context-aware responses powered by LLMs",
    "Performance evaluation and comparison tools",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        elevation={0}
        sx={{
          bgcolor: "transparent",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: `${theme.palette.primary.main}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" color="primary">
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
  );
};

export default LoginFeatures;
