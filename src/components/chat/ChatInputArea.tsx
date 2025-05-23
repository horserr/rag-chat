import React, { useState } from 'react';
import {
  Box, TextField, IconButton, Typography, useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const theme = useTheme();

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: '#ffffff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me anything..."
          value={inputText}
          multiline
          maxRows={4}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            marginRight: '12px',
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              backgroundColor: 'rgba(247, 250, 252, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(247, 250, 252, 0.9)',
              },
              '&.Mui-focused': {
                backgroundColor: 'white',
              }
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
          }}
        />        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={isLoading || inputText.trim() === ''}
          sx={{
            width: '48px',
            height: '48px',
            backgroundColor: (isLoading || inputText.trim() === '')
              ? '#e0e0e0'
              : theme.palette.primary.main,
            '&:hover': {
              backgroundColor: (isLoading || inputText.trim() === '')
                ? '#e0e0e0'
                : theme.palette.primary.dark
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              cursor: 'not-allowed'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <SendIcon sx={{
            color: (isLoading || inputText.trim() === '') ? '#9e9e9e' : 'white',
            fontSize: '1.2rem'
          }}/>
        </IconButton>
      </Box>      {/* Footer with information */}
      <Box sx={{
        mt: 1.5,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            opacity: 0.7,
            mb: 0.5
          }}
        >
          Powered by RAG Assistant • Press Enter to send, Shift+Enter for a new line
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            opacity: 0.7
          }}
        >
          © {new Date().getFullYear()} RAG Assistant Platform
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatInputArea;
