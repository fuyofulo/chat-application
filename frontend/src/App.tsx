import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Card from "./components/ui/Card";
import RoomChat from "./components/ui/ChatRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Card />} />
        <Route path="/chatroom" element={<RoomChat />} />
      </Routes>
    </Router>
  );
}

export default App;
