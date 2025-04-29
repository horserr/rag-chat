import styles from "../styles/ChatMessages.module.scss";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className={styles.chatMessages}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === "user" ? styles.user : styles.bot
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
