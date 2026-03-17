import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ListPage from './pages/ListPage';
import DetailsPage from './pages/DetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary-500/30">
          <Navbar />
          <div className="pt-20"> {/* Offset for fixed Navbar */}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/list" 
                element={
                  <ProtectedRoute>
                    <ListPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/details/:id" 
                element={
                  <ProtectedRoute>
                    <DetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/list" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
