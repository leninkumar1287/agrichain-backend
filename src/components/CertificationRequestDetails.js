import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Collapse
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { certificationAPI } from '../services/api';

const CertificationRequestDetails = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCheckpoint, setExpandedCheckpoint] = useState(null);
  const [expandedMedia, setExpandedMedia] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await certificationAPI.getRequestDetails(requestId);
        setRequest(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      case 'certified':
        return <CheckCircleIcon color="info" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'certified':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mx: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!request) {
    return (
      <Alert severity="info" sx={{ mt: 2, mx: 2 }}>
        Request not found
      </Alert>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {request.productName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {request.description}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={getStatusIcon(request.status)}
                  label={request.status.toUpperCase()}
                  color={getStatusColor(request.status)}
                  sx={{ 
                    fontWeight: 'bold',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Created: {new Date(request.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Request Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {request.farmer.username[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="body2">
                    <strong>Farmer:</strong> {request.farmer.username}
                  </Typography>
                </Box>
                {request.inspector && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {request.inspector.username[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">
                      <strong>Inspector:</strong> {request.inspector.username}
                    </Typography>
                  </Box>
                )}
                {request.certifier && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                      {request.certifier.username[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">
                      <strong>Certifier:</strong> {request.certifier.username}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Checkpoints Section */}
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DescriptionIcon color="primary" /> Checkpoints
        </Typography>
        <Grid container spacing={3}>
          {request.checkpoints.map((checkpoint) => (
            <Grid item xs={12} md={6} key={checkpoint.id}>
              <Zoom in={true} style={{ transitionDelay: `${checkpoint.id * 100}ms` }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">
                        Checkpoint {checkpoint.checkpointId}
                      </Typography>
                      <IconButton
                        onClick={() => setExpandedCheckpoint(expandedCheckpoint === checkpoint.id ? null : checkpoint.id)}
                      >
                        {expandedCheckpoint === checkpoint.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedCheckpoint === checkpoint.id}>
                      <Typography variant="body1" paragraph>
                        {checkpoint.answer}
                      </Typography>
                      {checkpoint.mediaUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={checkpoint.mediaUrl}
                          alt={`Checkpoint ${checkpoint.checkpointId} media`}
                          sx={{ 
                            objectFit: 'contain',
                            borderRadius: 1,
                            boxShadow: 2
                          }}
                        />
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Additional Media Section */}
        <Box sx={{ mt: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              mb: 2
            }}
            onClick={() => setExpandedMedia(!expandedMedia)}
          >
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon color="primary" /> Additional Media
            </Typography>
            <IconButton>
              {expandedMedia ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={expandedMedia}>
            <Grid container spacing={3}>
              {request.media.map((media) => (
                <Grid item xs={12} sm={6} md={4} key={media.id}>
                  <Zoom in={true} style={{ transitionDelay: `${media.id * 100}ms` }}>
                    <Card 
                      sx={{ 
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardMedia
                        component={media.type === 'video' ? 'video' : 'img'}
                        height="200"
                        image={media.url}
                        alt={`Media ${media.id}`}
                        controls={media.type === 'video'}
                        sx={{ 
                          objectFit: 'contain',
                          backgroundColor: 'black'
                        }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {media.type === 'video' ? <VideoIcon color="primary" /> : <ImageIcon color="primary" />}
                          <Typography variant="body2" color="text.secondary">
                            Uploaded: {new Date(media.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Box>
      </Box>
    </Fade>
  );
};

export default CertificationRequestDetails; 