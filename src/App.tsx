import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import DataManager from "./pages/DataManager";
import Shop from "./pages/Shop";
import ResultModal from "./components/ResultModal";

function App() {
//  localStorage.clear();
//  location.reload();
  return (
    <Router>

      <ResultModal />

      <nav className="footer-nav">
        <Link to="/" className="nav-item">
          <span className="icon">🏠</span>
          <span className="label">ホーム</span>
        </Link>
        <Link to="/explore" className="nav-item">
          <span className="icon">⚔️</span>
          <span className="label">探索</span>
        </Link>
        <Link to="/shop" className="nav-item">
          <span className="icon">💰</span>
          <span className="label">ショップ</span>
        </Link>
        <Link to="/data" className="nav-item">
          <span className="icon">⚙️</span>
          <span className="label">設定</span>
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/shop" element={<Shop  />} />
        <Route path="/data" element={<DataManager />} />
      </Routes>
      
    </Router>
  );
}

export default App;