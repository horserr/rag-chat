import React, { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import ChatHistorySidebar from '../components/chat/ChatHistorySidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessageList from '../components/chat/ChatMessageList';
import ChatInputArea from '../components/chat/ChatInputArea';
import { useChat } from '../hooks/useChat';

/**
 * ChatPage component represents the main chat interface
 * It includes the chat history sidebar, message list, and input area
 */
const ChatPage: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);

  const handleToggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
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
        <ChatHistorySidebar isOpen={isHistoryPanelOpen} />
      </Collapse>

      {/* Main Chat Content Area */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.default',
        overflow: 'hidden' // Prevents shadow issues with inner scrolling content
      }}>
        {/* Header with toggle button for history panel */}
        <ChatHeader
          isHistoryPanelOpen={isHistoryPanelOpen}
          onToggleHistoryPanel={handleToggleHistoryPanel}
        />

        {/* Messages Area */}
        <ChatMessageList messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <ChatInputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default ChatPage;
