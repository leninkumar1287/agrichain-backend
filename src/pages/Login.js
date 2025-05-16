import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // email or mobile
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [mobileForOtp, setMobileForOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOtpError('');

    // Simulate fetching mobile number from backend for OTP (replace with real API in production)
    let mobile = formData.identifier;
    if (mobile.includes('@')) {
      // If identifier is email, fetch mobile from backend (mock here)
      // Example: const user = await fetchUserByEmail(formData.identifier);
      // mobile = user.mobile;
      // For demo, just use a dummy mobile
      mobile = '9876543210';
    }
    setMobileForOtp(mobile);

    setShowOtp(true);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    const expectedOtp = mobileForOtp.slice(-6);

    if (otp !== expectedOtp) {
      setOtpError("Invalid OTP. Please enter the last 6 digits of your mobile number.");
      return;
    }

    // Proceed with login API call
    // Replace with your real login logic
    const result = await login(formData);
    if (result.success) {
      // Redirect based on role or dashboard
      navigate('/farmer/dashboard');
    } else {
      setError(result.error);
      setShowOtp(false);
      setOtp('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `
          linear-gradient(120deg, #e0f7fa 60%, #fffde7 100%),
          url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            {!showOtp ? (
              <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="identifier"
                  label="Email"
                  name="identifier"
                  autoComplete="off"
                  value={formData.identifier}
                  onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={
                    !formData.identifier ||
                    !formData.password
                  }
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/register')}
                >
                  Don't have an account? Sign Up
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleOtpSubmit} autoComplete="off" sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  error={!!otpError}
                  helperText={otpError || `OTP has been sent to your registered mobile number ending with (***${mobileForOtp.slice(-4)})`}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit OTP
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setShowOtp(false);
                    setOtp('');
                    setOtpError('');
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Login; 