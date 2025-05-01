import React from "react";
import { Row, Col } from "antd";
import HistoryPanel from "../components/HistoryPanel/HistoryPanel";
import ChatPanel from "../components/ChatPanel/ChatPanel";
import NormalLayout from "../layouts/NormalLayout";

const Chat: React.FC = () => {
  return (
    <NormalLayout breadcrumbs={["Home", "Chat"]}>
      <Row gutter={[16, 16]}>
        {/* 左侧 HistoryPanel 占 3/10 */}
        <Col span={7}>
          <HistoryPanel />
        </Col>
        {/* 右侧 ChatPanel 占 7/10 */}
        <Col span={17}>
          <ChatPanel />
        </Col>
      </Row>
    </NormalLayout>
  );
};

export default Chat;
