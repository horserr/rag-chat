import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 500,
        width: "100%",
        mx: "auto",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm onSwitchToRegister={switchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={switchToLogin} />
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default AuthContainer;
