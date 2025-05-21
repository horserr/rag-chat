import React, { useState, useRef, useEffect } from 'react';
import {
  Box, TextField, Paper, Typography, CircularProgress, Avatar,
  IconButton, Divider, Tooltip, Badge, Button, Chip, useTheme,
  Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import HistoryIcon from '@mui/icons-material/History';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../types';

const ChatPage: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true); // State for history panel
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* History Panel with animation */}
      <Collapse
        in={isHistoryPanelOpen}
        orientation="horizontal"
        timeout={300}
        sx={{
          height: '100%',
          overflow: 'hidden',
          transitionProperty: 'width, min-width, max-width',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '300ms',
          width: isHistoryPanelOpen ? '280px' : '0px',
          minWidth: isHistoryPanelOpen ? '280px' : '0px',
          maxWidth: isHistoryPanelOpen ? '280px' : '0px',
          position: 'relative',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '280px',
            flexShrink: 0,
            padding: '16px',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'rgba(247,250,252,0.7)',
            transition: 'opacity 300ms ease',
            opacity: isHistoryPanelOpen ? 1 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HistoryIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: '1.05rem',
                color: theme.palette.text.primary
              }}
            >
              Chat History
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* History items with some example items */}
          <Box sx={{ mb: 1 }}>
            {[1, 2, 3].map((item) => (
              <Button
                key={item}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  borderRadius: '10px',
                  backgroundColor: item === 1 ? 'rgba(67, 97, 238, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(67, 97, 238, 0.12)',
                  },
                  color: theme.palette.text.primary
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: item === 1 ? 600 : 400,
                      mb: 0.5,
                      color: item === 1 ? theme.palette.primary.main : 'inherit',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {`Chat Session ${item}`}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Badge
                      color="primary"
                      variant="dot"
                      sx={{ mr: 1, display: item === 1 ? 'inline-flex' : 'none' }}
                    />
                    May {17 + item}, 2025
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Create new chat">
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: '10px',
                py: 1,
                borderColor: 'rgba(0,0,0,0.1)',
                color: theme.palette.text.secondary
              }}
            >
              + New Chat
            </Button>
          </Tooltip>
        </Paper>
      </Collapse>

      {/* Main Chat Content Area */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden' // Prevents shadow issues with inner scrolling content
      }}>
        {/* Toggle Button for History Panel */}
        <Box sx={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Tooltip title={isHistoryPanelOpen ? "Hide history" : "Show history"}>
            <IconButton
              onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                mr: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(67, 97, 238, 0.08)',
                  color: theme.palette.primary.main
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            New Chat Session
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            label="Active"
            size="small"
            color="primary"
            sx={{
              height: '24px',
              backgroundColor: 'rgba(67, 97, 238, 0.1)',
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>

        {/* Messages Area */}
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
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.text.secondary,
                opacity: 0.8
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  backgroundColor: 'rgba(67, 97, 238, 0.1)',
                  color: theme.palette.primary.main
                }}
              >
                <SmartToyOutlinedIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                How can I help you today?
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 400, textAlign: 'center' }}>
                Ask me any question and I'll do my best to provide accurate and helpful information.
              </Typography>
            </Box>
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

        {/* Input Area */}
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
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={isLoading || inputText.trim() === ''}
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: (isLoading || inputText.trim() === '') ? 'rgba(67, 97, 238, 0.3)' : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <SendIcon sx={{ color: 'white', fontSize: '1.2rem' }}/>
            </IconButton>
          </Box>

          {/* Footer with information */}
          <Box sx={{
            mt: 1.5,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.7rem',
                opacity: 0.7
              }}
            >
              Powered by RAG Assistant • Press Enter to send, Shift+Enter for a new line
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
