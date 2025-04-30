import HistoryPanel from "./components/HistoryPanel/HistoryPanel"; // 导入历史记录面板组件
import ChatPanel from "./components/ChatPanel/ChatPanel"; // 导入聊天面板组件
import styles from "@styles/pages/App.module.scss"; // 导入 CSS Modules

function App() {
  return (
    <div className={styles.App}>
      <HistoryPanel />
      <ChatPanel />
    </div>
  );
}

export default App;
