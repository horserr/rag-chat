import { useState } from "react";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import styles from "./styles/App.module.scss"; // 导入 CSS Modules

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

function App() {
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
