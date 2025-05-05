import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Play from './pages/Play';
import UserAIs from "./pages/UserAIs"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/play/:strategy" element={<Play />} />
        <Route path="/user-ai" element={<UserAIs />} /> 
      </Routes>
    </Router>
  );
}

export default App;
