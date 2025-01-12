import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.css';

import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import TodayPage from './pages/TodayPage';
import NotFoundPage from './pages/NotFoundPage'; 
// import HistoryPage from './pages/HistoryPage';
// import InsightsPage from './pages/InsightsPage';

// import TestPage from './pages/TestPage';



// our main a function which has our page routes
function App() {
  return (
    <div className="h-screen bg-custombg">
    <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* <Route path="/today" element={<TodayPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> */}

          {/* Protected Routes */}
          <Route
            path="/today"
            element={
              <ProtectedRoute>
                <TodayPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />  


          {/* 404 Page */}
         <Route path="*" element={<NotFoundPage />} />


        </Routes>

    </ThemeProvider>
    </div>
  );
}

export default App;