import { useEffect, useRef } from "react";
import { marked } from "marked";
import styles from "@styles/components/ChatPanel/ChatMessages.module.scss";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
  isStreaming?: boolean; // Flag to indicate if this message is currently being streamed
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to format text based on sender
  const formatText = (text: string, sender: "user" | "bot") => {
    if (sender === "user") {
      // For user messages, just split by newlines
      return text.split('\n').map((paragraph, index) => (
        <p key={index} className={styles.paragraph}>
          {paragraph}
        </p>
      ));
    } else {
      // For bot messages, use marked to render markdown
      // Configure marked options
      marked.setOptions({
        breaks: true, // Convert line breaks to <br>
        gfm: true     // Enable GitHub Flavored Markdown
      });

      // Parse the markdown to HTML
      const html = marked.parse(text);

      // Use dangerouslySetInnerHTML to render the HTML
      return (
        <div
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  };

  // Format timestamp to a readable format
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatMessages}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === "user" ? styles.user : styles.bot
          }`}
        >
          <div className={`${styles.messageContent} ${message.isStreaming ? styles.streaming : ''}`}>
            {formatText(message.text, message.sender)}
            {message.isStreaming && (
              <span className={styles.streamingIndicator}>●</span>
            )}
          </div>
          {message.timestamp && (
            <div className={styles.timestamp}>
              {message.isStreaming ? 'Typing...' : formatTime(message.timestamp)}
            </div>
          )}
        </div>
      ))}
      {/* This empty div is used as a reference for scrolling to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
