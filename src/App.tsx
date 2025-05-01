import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/PageElements/Footer";
import NavBar from "./components/PageElements/NavBar";

import Chat from "./pages/Chat";
import Evaluation from "./pages/Evaluation";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// styles
import styles from "@styles/layouts/NormalLayout.module.scss";

function App() {
  return (
    <div className={styles.NormalLayout}>
      <BrowserRouter>
        <NavBar />
        <div className={styles.contentLayout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/index" element={<Home />} />

            <Route path="/chat" element={<Chat />} />
            {/* very important for '*' */}
            <Route path="/evaluation/*" element={<Evaluation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
