import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import FamilyPortal from './pages/FamilyPortal';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
// import InvestorDemo from './pages/InvestorDemo';
import LiveDemo from './pages/LiveDemo';
import PatientApp from './pages/PatientApp';

// Components
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App bg-gray-50 min-h-screen">
        <ScrollToTop />
        <Navigation />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/live-demo" element={<LiveDemo />} />
          <Route path="/demo" element={<LiveDemo />} />
          <Route path="/family" element={<FamilyPortal />} />
          <Route path="/family-preview" element={<FamilyPortal />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider-preview" element={<ProviderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-preview" element={<AdminDashboard />} />
          <Route path="/patient" element={<PatientApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;