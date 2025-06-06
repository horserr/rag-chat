import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, InputAdornment } from "@mui/material";
import { Security } from "@mui/icons-material";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
  error?: boolean;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onVerify, error }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Generate random numbers for captcha
  const generateNumbers = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    setIsValid(false);
    onVerify(false);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  useEffect(() => {
    const correctAnswer = num1 + num2;
    const userNum = parseInt(userAnswer);
    const valid = !isNaN(userNum) && userNum === correctAnswer;
    setIsValid(valid);
    onVerify(valid);
  }, [userAnswer, num1, num2, onVerify]);

  const handleAnswerChange = (value: string) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setUserAnswer(value);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Human Verification
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ minWidth: "80px" }}>
          {num1} + {num2} =
        </Typography>
        <TextField
          size="small"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          error={error || (userAnswer !== "" && !isValid)}
          placeholder="?"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Security color={isValid ? "success" : "action"} />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100px" }}
        />
        <Typography
          variant="caption"
          color={isValid ? "success.main" : "text.secondary"}
          sx={{ cursor: "pointer" }}
          onClick={generateNumbers}
        >
          {isValid ? "✓ Verified" : "Click to refresh"}
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleCaptcha;
