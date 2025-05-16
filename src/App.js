import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/farmer/Dashboard';
import InspectorDashboard from './pages/inspector/Dashboard';
import CertifierDashboard from './pages/certifier/Dashboard';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import CertificationRequestDetails from './components/CertificationRequestDetails';
import Home from './pages/Home/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with Layout */}
            <Route
              path="/farmer/dashboard"
              element={
                <PrivateRoute allowedRoles={['farmer']}>
                  <Layout>
                  <FarmerDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/inspector/dashboard"
              element={
                <PrivateRoute allowedRoles={['inspector']}>
                  <Layout>
                  <InspectorDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/certifier/dashboard"
              element={
                <PrivateRoute allowedRoles={['certificate_issuer']}>
                  <Layout>
                  <CertifierDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={['certificate_issuer']}>
                  <Layout>
                  <UserManagement />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <Layout>
                  <Profile />
                </Layout>
              } 
            />
            <Route 
              path="/certification/:requestId" 
              element={
                <Layout>
                  <CertificationRequestDetails />
                </Layout>
              } 
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
