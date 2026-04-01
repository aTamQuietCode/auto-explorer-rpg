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

      <nav className="nav-container">
        <Link to="/">ホーム</Link>
        <Link to="/explore">探索</Link>
        <Link to="/Shop">Shop</Link>
        <Link to="/data">データ管理</Link>
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