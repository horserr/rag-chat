import { useState } from "react";
import { BuildOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import { ChatIcon } from "../assets/Icons";

const { Header } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/chat">Chat</Link>,
    key: "chat",
    icon:<BuildOutlined />
    // icon: <ChatIcon />,
    // disabled: true,
  },
  {
    label: <Link to="/evaluation">Evaluation</Link>,
    key: "evaluation",
    icon: <SettingOutlined />,
  },
];

function NavBar() {
  const [current, setCurrent] = useState("home");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div className="demo-logo" />
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

export default NavBar;
