import { useState } from "react";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import styles from "./styles/App.module.scss"; // 导入 CSS Modules

function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello!" },
    { id: 2, sender: "bot", text: "Hi there! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: input },
    ]);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "bot", text: "This is a bot response." },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className={styles["app-container"]}>
      <div className={styles["history-panel"]}>
        {/* 预留历史记录区域 */}
        <p>History (Coming Soon)</p>
      </div>
      <div className={styles["chat-panel"]}>
        <ChatMessages messages={messages} />
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
