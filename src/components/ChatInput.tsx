import styles from "../styles/ChatInput.module.scss";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const ChatInput = ({ input, setInput, handleSend }: ChatInputProps) => {
  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={styles.input}
      />
      <button onClick={handleSend} className={styles.button}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
