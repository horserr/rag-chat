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
  // Create refs for the messages container and end element
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    // Try both methods for better compatibility
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
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

  // Format timestamp to a readable format using local timezone
  const formatTime = (date?: Date) => {
    if (!date) return '';

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date at midnight for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format options for different cases
    if (date >= today) {
      // If the message is from today, show only time
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (date >= yesterday) {
      // If the message is from yesterday, show "Yesterday" and time
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    } else {
      // For older messages, show full date and time
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div className={styles.chatMessages} ref={messagesContainerRef}>
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
      <div ref={messagesEndRef} style={{ height: '1px', marginTop: '8px' }} />
    </div>
  );
};

export default ChatMessages;
