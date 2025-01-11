import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatApp from './components/chat';
import LandingPage from './components/landingpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat/:roomId" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
