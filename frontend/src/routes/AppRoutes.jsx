import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from '../features/Auth/SignupForm'
import Home from '../pages/Home';
import Login from '../features/Auth/LoginForm';
import History from '../pages/History';
import GrowthRecord from '../pages/GrowthRecord';
import SharedLetter from '../pages/SharedLetter';
import { useAuth } from '../contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/share/:token" element={<SharedLetter />} />
      <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignupForm />} />
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

      {/* Protected Routes */}
      {/* Protected Routes */}
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
      <Route path="/growth" element={
        <ProtectedRoute>
          <GrowthRecord />
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;