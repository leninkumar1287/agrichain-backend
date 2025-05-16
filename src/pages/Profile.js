import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, CircularProgress, Paper, Button, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import NavBar from '../components/NavBar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      });
        if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
    } finally {
      setLoading(false);
    }
  };
      fetchProfile();
  }, []);

  return (
    <>
      <Box minHeight="70vh" bgcolor="#f5f7fa" display="flex" alignItems="center" justifyContent="center" p={2}>
        <Paper elevation={6} sx={{ maxWidth: 420, width: '100%', borderRadius: 4, p: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)' }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3} color="primary">
            My Profile
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center">{error}</Typography>
          ) : profile ? (
            <Card elevation={0} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mb: 2, fontSize: 40 }}>
                    {profile.username?.[0]?.toUpperCase() || <PersonIcon fontSize="large" />}
          </Avatar>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {profile.username}
                  </Typography>
        </Box>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1">{profile.email}</Typography>
        </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <BadgeIcon color="secondary" />
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{profile.role}</Typography>
        </Box>
                </Stack>
                {/* <Button variant="outlined" color="primary" fullWidth sx={{ mt: 4 }}>
                  Edit Profile
                </Button> */}
              </CardContent>
            </Card>
          ) : null}
      </Paper>
    </Box>
    </>
  );
};

export default Profile; 