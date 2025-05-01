import { Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Chat from "./pages/Chat";
import Evaluation from "./pages/Evaluation";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const { Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </BrowserRouter>
  );
}

export default App;
