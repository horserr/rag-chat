import { useState, useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import Welcome from "./Welcome";
import styles from "@styles/components/ChatPanel/ChatPanel.module.scss"; // Import CSS Modules
import { Box, CircularProgress } from "@mui/material";
import { MessageService } from "../../services/message_service";
import { MessageDto } from "../../models/message";

// Interface to convert MessageDto to the format expected by ChatMessages
interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const ChatPanel = (param: {
  sessionId: number;
  token: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageService, setMessageService] = useState<MessageService | null>(null);

  // Initialize or update the message service when sessionId changes
  useEffect(() => {
    if (param.sessionId !== 0) {
      setMessageService(new MessageService(param.token, param.sessionId));
    }
  }, [param.sessionId, param.token]);

  // Load messages when the session changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (param.sessionId === 0 || !messageService) return;

      setLoading(true);
      try {
        const response = await messageService.get_messages(0, 100); // Get up to 100 messages
        // Convert MessageDto to Message format
        const formattedMessages = response.data.map((msg: MessageDto) => ({
          id: msg.id,
          sender: msg.role === "User" ? "user" as const : "bot" as const,
          text: msg.content
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [param.sessionId, messageService]);

  const handleSend = async () => {
    if (input.trim() === "" || !messageService) return;

    const userMessage: Message = {
      id: Date.now(), // Temporary ID until we get the real one from the server
      sender: "user",
      text: input,
    };

    // Optimistically add the user message to the UI
    setMessages((prev) => [...prev, userMessage]);
    const inputContent = input; // Store the input before clearing it
    setInput("");

    try {
      // Send the message to the server
      await messageService.sendMessage(inputContent);

      // The server should automatically generate the assistant's response
      // Refresh the messages to get both the user message and the assistant's response
      const messagesResponse = await messageService.get_messages(0, 100);

      // Convert MessageDto to Message format
      const formattedMessages = messagesResponse.data.map((msg: MessageDto) => ({
        id: msg.id,
        sender: msg.role === "User" ? "user" as const : "bot" as const,
        text: msg.content
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      // If there's an error, keep the optimistic update
    }
  };

  // If no session is selected (sessionId is 0), show the welcome screen
  if (param.sessionId === 0) {
    return <Welcome />;
  }

  // Show loading indicator while fetching messages
  if (loading) {
    return (
      <Box className={styles.chatPanel} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Otherwise, show the chat interface
  return (
    <Box className={styles.chatPanel}>
      <ChatMessages messages={messages} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </Box>
  );
};

export default ChatPanel;
