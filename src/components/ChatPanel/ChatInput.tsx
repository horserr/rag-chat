import sendIcon from "@assets/send.svg";
import styles from "@styles/components/ChatPanel/ChatInput.module.scss";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const ChatInput = ({ input, setInput, handleSend }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        value={input}
        onKeyDown={handleKeyPress}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={styles.input}
      />
      <button onClick={handleSend} className={styles.button}>
        <img src={sendIcon} alt="Send" className={styles.icon} />
      </button>
    </div>
  );
};

export default ChatInput;
