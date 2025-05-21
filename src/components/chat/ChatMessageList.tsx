import React, { useRef, useEffect } from 'react';
import {
  Box, Paper, Typography, CircularProgress, Avatar, useTheme
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import type { ChatMessage } from '../../types';
import WelcomeMessage from './WelcomeMessage';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Paper
      elevation={0}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: 'transparent',
        backgroundImage: 'radial-gradient(rgba(67, 97, 238, 0.03) 2px, transparent 2px)',
        backgroundSize: '24px 24px',
      }}
    >
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        messages.map((msg: ChatMessage, index) => (
          <Box
            key={msg.id}
            className="message-animation"
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '24px',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              maxWidth: '80%'
            }}>
              <Avatar
                sx={{
                  bgcolor: msg.sender === 'user'
                    ? 'rgba(67, 97, 238, 0.1)'
                    : 'rgba(67, 97, 238, 0.05)',
                  color: msg.sender === 'user'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  marginLeft: msg.sender === 'user' ? '12px' : 0,
                  marginRight: msg.sender === 'user' ? 0 : '12px',
                  width: 36,
                  height: 36,
                }}
              >
                {msg.sender === 'user'
                  ? <PersonOutlineOutlinedIcon fontSize="small" />
                  : <SmartToyOutlinedIcon fontSize="small" />
                }
              </Avatar>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0.5,
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      ml: msg.sender === 'user' ? 0 : 1,
                      mr: msg.sender === 'user' ? 1 : 0,
                      fontWeight: 500
                    }}
                  >
                    {msg.sender === 'user' ? 'You' : 'Assistant'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      opacity: 0.6,
                      ml: msg.sender === 'user' ? 0 : 1,
                      mr: msg.sender === 'user' ? 1 : 0,
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </Box>
                <Paper
                  elevation={0}
                  className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                  sx={{
                    padding: '14px 20px',
                    display: 'inline-block',
                    maxWidth: '100%',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.6
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        ))
      )}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '0 16px 16px',
            animationDelay: `${messages.length * 0.1}s`,
          }}
          className="message-animation"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(67, 97, 238, 0.05)',
                color: theme.palette.secondary.main,
                marginRight: '12px',
                width: 36,
                height: 36,
              }}
            >
              <SmartToyOutlinedIcon fontSize="small" />
            </Avatar>
            <Paper
              elevation={0}
              sx={{
                padding: '16px 24px',
                backgroundColor: 'white',
                borderRadius: '18px 18px 18px 0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CircularProgress size={20} color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="body2" color="textSecondary">
                Thinking...
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Paper>
  );
};

export default ChatMessageList;
