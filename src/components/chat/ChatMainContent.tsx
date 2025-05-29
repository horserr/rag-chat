import React from 'react';
import { Box } from '@mui/material';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import type { ChatMessage } from '../../types';

interface ChatMainContentProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isHistoryPanelOpen: boolean;
  onToggleHistoryPanel: () => void;
  onSendMessage: (text: string) => void;
}

/**
 * ChatMainContent - Main chat content area
 * Contains the header, message list, and input area
 */
const ChatMainContent: React.FC<ChatMainContentProps> = ({
  messages,
  isLoading,
  isHistoryPanelOpen,
  onToggleHistoryPanel,
  onSendMessage
}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Header with toggle button for history panel */}
      <ChatHeader
        isHistoryPanelOpen={isHistoryPanelOpen}
        onToggleHistoryPanel={onToggleHistoryPanel}
      />

      {/* Messages Area */}
      <ChatMessageList messages={messages} isLoading={isLoading} />

      {/* Input Area */}
      <ChatInputArea
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default ChatMainContent;
