import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import styles from "@styles/components/ChatPanel/ChatPanel.module.scss"; // Import CSS Modules
import { Box } from "@mui/material";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(), // Use timestamp as a unique ID
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]); // Add user's message to the chat
    setInput("");

    try {
      const response = await fetch("https:localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      // add bot's message to the chat
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply, // Assuming the backend returns { reply: "..." }
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box className={styles.chatPanel}>
      <ChatMessages messages={messages} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </Box>
  );
};

export default ChatPanel;
