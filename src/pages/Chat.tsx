import ChatPanel from "../components/ChatPanel/ChatPanel";
import HistoryPanel from "../components/HistoryPanel/HistoryPanel";
import LayoutFactory from "../layouts/LayoutFactory";
import types from "../layouts/LayoutTypes"; // 引入布局类型枚举

const Chat: React.FC = () => {
  return (
    <LayoutFactory breadcrumbs={["Home", "Chat"]} layoutType={types.chatLayout}>
      <HistoryPanel />
      <ChatPanel />
    </LayoutFactory>
  );
};

export default Chat;
