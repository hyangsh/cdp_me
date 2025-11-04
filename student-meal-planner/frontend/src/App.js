
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import WeeklySummaryPage from './pages/WeeklySummaryPage'; // Import the new page
import SettingsPage from './pages/SettingsPage'; // Import the new page
import FooterNav from './components/FooterNav';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/weekly" element={<WeeklySummaryPage />} /> {/* Add the new route */}
          <Route path="/settings" element={<SettingsPage />} /> {/* Add the new route */}
        </Routes>
        <FooterNav />
      </div>
    </Router>
  );
}

export default App;
