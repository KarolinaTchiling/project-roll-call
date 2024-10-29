import { Routes, Route } from 'react-router-dom';
import SummaryPage from './pages/SummaryPage';
import DBport from './pages/DBport';
// import Navbar from './components/Navbar';
// import TestPage from './pages/TestPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SummaryPage />} />
        <Route path="/DBport" element={<DBport />} />
      </Routes>
    </div>
  );
}

export default App;