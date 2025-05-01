import { useState } from "react";
import {
  BuildOutlined,
  HomeOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import styles from "@styles/layouts/NormalLayout.module.scss";

const { Header } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function NavBar() {
  const [current, setCurrent] = useState("home");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Header
      style={{
        fontSize: "10rem",
        display: "flex",
        alignItems: "center",
        height: "10vh",
        width: "100vw",
      }}
    >
      <Menu
        theme="dark"
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </Header>
  );
}

const items: MenuItem[] = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/chat">Chat</Link>,
    key: "chat",
    icon: <BuildOutlined />,
  },
  {
    label: <Link to="/evaluation">Evaluation</Link>,
    key: "evaluation",
    icon: <NodeIndexOutlined />,
  },
];

export default NavBar;
