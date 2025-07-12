import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import VibeBot from "./components/VibeBot";
import VibeSearch from "./components/VibeSearch";
import VibeNavigator from "./components/VibeNavigator"; // if you want combined view later

function App() {
  return (
    <Router>
      <Sidebar />
      <Navbar />
      <div className=""> {/* Add padding so content isn't hidden under navbar/sidebar */}
        <Routes>
          <Route path="/" element={<VibeSearch />} />
          <Route path="/ask-ai" element={<VibeBot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
