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
  MenuItem,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    role: 'farmer',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setShowOtp(true);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    const expectedOtp = formData.mobile.slice(-6);
    if (otp !== expectedOtp) {
      setOtpError(
        'Invalid OTP. Please enter the last 6 digits of your mobile number.'
      );
      return;
    }

    const result = await register(formData);
    if (result.success) {
      switch (formData.role) {
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'inspector':
          navigate('/inspector/dashboard');
          break;
        case 'certificate_issuer':
          navigate('/certifier/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
      setShowOtp(false);
      setOtp('');
    }
  };

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
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              width: '100%',
              maxWidth: 500,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.92)',
              boxShadow: 6,
              // border: '2px solid #a5d6a7'
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              align="center"
              sx={{ color: '#388e3c', fontWeight: 700, mb: 1, letterSpacing: 1 }}
            >
              Sign Up
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            {!showOtp ? (
              <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ mt: 1 }}>
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="mobile"
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  autoComplete="off"
                  value={formData.mobile}
                  onChange={handleChange}
                  inputProps={{ maxLength: 20 }}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  error={!!confirmPassword && formData.password !== confirmPassword}
                  helperText={!!confirmPassword && formData.password !== confirmPassword ? "Passwords do not match" : ""}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="farmer">Farmer</MenuItem>
                  <MenuItem value="inspector">Inspector</MenuItem>
                  <MenuItem value="certificate_issuer">Certificate Issuer</MenuItem>
                </TextField>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mt: 2, mb: 1 }}
                  size="small"
                  disabled={
                    !formData.username ||
                    !formData.email ||
                    !formData.mobile ||
                    !formData.password ||
                    !confirmPassword ||
                    formData.password !== confirmPassword
                  }
                >
                  Sign Up
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Sign In
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleOtpSubmit} autoComplete="off" sx={{ mt: 1 }}>
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  error={!!otpError}
                  helperText={otpError || `OTP sent to ***${formData.mobile.slice(-4)}`}
                />
                <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2 }} size="small">
                  Submit OTP
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => {
                    setShowOtp(false);
                    setOtp('');
                  }}
                  sx={{ mt: 1 }}
                >
                  Back to Registration
                </Button>
              </Box>
            )}
          </Paper>

        </Box>
      </Container>
      <br/>

      <Footer />
    </Box>
  );
};

export default Register;
