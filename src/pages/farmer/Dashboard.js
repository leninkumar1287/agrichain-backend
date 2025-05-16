import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem, // <-- add MenuItem here if not already present
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
  useTheme,
  CardMedia,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  ZoomIn as ZoomInIcon,
  Undo as UndoIcon,
  Info as InfoIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Checklist as ChecklistIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAuth } from '../../context/AuthContext';
import LocationMap from '../../components/LocationMap';
import NavBar from '../../components/NavBar';
import CertificateDetailsModal from '../../components/CertificateDetailsModal';

const statusColorMap = {
  pending:    { bg: '#ffb300', color: '#fff' }, // Amber
  in_progress:{ bg: '#1976d2', color: '#fff' }, // Blue
  approved:   { bg: '#43a047', color: '#fff' }, // Green
  certified:  { bg: '#00897b', color: '#fff' }, // Teal
  rejected:   { bg: '#e53935', color: '#fff' }, // Red
  reverted:   { bg: '#757575', color: '#fff' }, // Grey
};

const statusLabels = {
  pending: "Request Submitted",
  in_progress: "Inspection Started",
  approved: "Approved",
  rejected: "Rejected",
  certified: "Certified",
  reverted: "Reverted"
};

const statusDotColors = {
  pending: "warning",
  in_progress: "info",
  approved: "success",
  certified: "primary",
  rejected: "error",
  reverted: "grey"
};

const checkpointQuestions = [
  "Is the land free from prohibited substances?",
  "Are organic seeds used?",
  "Is there a buffer zone?",
  "Is crop rotation practiced?",
  "Are synthetic fertilizers avoided?",
  "Is compost used?",
  "Are pesticides organic?",
  "Is irrigation water clean?",
  "Are records maintained?",
  "Is livestock managed organically?",
  "Is GMO use avoided?",
  "Are buffer zones marked?",
  "Is soil tested regularly?",
  "Are weeds managed organically?",
  "Is manure composted?",
  "Are organic certificates displayed?",
  "Is equipment cleaned before use?",
  "Are storage areas separate?",
  "Is packaging eco-friendly?",
  "Are transport vehicles clean?"
];

// Styled Components
const DashboardContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  maxWidth: '100% !important',
  margin: 0,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const BlockchainInfo = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '15px',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
    width: '100%',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  background: 'rgba(255,255,255,0.95)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'approved' ? theme.palette.success.light :
      status === 'pending' ? theme.palette.warning.light :
        status === 'rejected' ? theme.palette.error.light :
          theme.palette.info.light,
  color: 'white',
  fontWeight: 'bold',
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
  '& .preview-image-container': {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const AtmCard = styled(Card)(({ theme }) => ({
  width: 400,
  height: 240,
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  margin: 'auto',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: 220,
  },
}));

const AtmCardMedia = styled(CardMedia)({
  height: 120,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  objectFit: 'cover',
});

const AtmCardContent = styled(CardContent)({
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  gap: 8,
});

const TransactionHash = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontFamily: 'monospace',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

const initialRequestState = {
  productName: '',
  description: '',
  checkpointAnswers: Array(20).fill({ answer: '', media: null }),
  location: { address: '' },
  images: [],
  location: {
    latitude: 0,
    longitude: 0,
    address: '',
  },
  checkpointAnswers: Array(20).fill({ answer: '', media: null })
};

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequest, setNewRequest] = useState(initialRequestState);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [revertLoading, setRevertLoading] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certDetails, setCertDetails] = useState(null);
  const [certDetailsLoading, setCertDetailsLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImage, setGalleryImage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/certification/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error fetching certification requests',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const previewImages = files.map(file => URL.createObjectURL(file));
    setNewRequest(prev => ({
      ...prev,
      images: [...prev.images, ...previewImages],
    }));
  };

  const handleFileUpload = async (file, idx) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    // data.url should be the uploaded file's URL

    setNewRequest(prev => {
      const answers = [...prev.checkpointAnswers];
      answers[idx] = { ...answers[idx], media: data.url }; // Save the URL, not the File object
      return { ...prev, checkpointAnswers: answers };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(location);
          setNewRequest(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: location.lat,
              longitude: location.lng
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setSnackbar({
            open: true,
            message: 'Error getting current location',
            severity: 'error'
          });
        }
      );
    } else {
      setSnackbar({
        open: true,
        message: 'Geolocation is not supported by your browser',
        severity: 'error'
      });
    }
  };

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setSelectedLocation(location);
    setNewRequest(prev => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: location.lat,
        longitude: location.lng
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const checkpoints = [
        { id: 1, requiredMedia: true },
        { id: 2, requiredMedia: false },
        { id: 3, requiredMedia: true },
        { id: 4, requiredMedia: false },
        { id: 5, requiredMedia: false },
        { id: 6, requiredMedia: false },
        { id: 7, requiredMedia: true },
        { id: 8, requiredMedia: false },
        { id: 9, requiredMedia: false },
        { id: 10, requiredMedia: true },
        { id: 11, requiredMedia: false },
        { id: 12, requiredMedia: true },
        { id: 13, requiredMedia: false },
        { id: 14, requiredMedia: false },
        { id: 15, requiredMedia: false },
        { id: 16, requiredMedia: true },
        { id: 17, requiredMedia: false },
        { id: 18, requiredMedia: true },
        { id: 19, requiredMedia: false },
        { id: 20, requiredMedia: true },
      ];
      // Build checkpoints array with id, answer, and mediaUrl (string only)
      const checkpointsToSend = checkpoints.map((cp, idx) => ({
        id: cp.id,
        answer: newRequest.checkpointAnswers[idx]?.answer || '',
        mediaUrl: typeof newRequest.checkpointAnswers[idx]?.media === 'string'
          ? newRequest.checkpointAnswers[idx]?.media
          : null
      }));
      for (let i = 0; i < 20; i++) {
        const answer = newRequest.checkpointAnswers[i]?.answer;
        const media = newRequest.checkpointAnswers[i]?.media;
        if (checkpoints[i].requiredMedia && answer === 'yes' && !media) {
          setSnackbar({
            open: true,
            message: `Please upload media for checkpoint ${i + 1} before submitting.`,
            severity: 'error'
          });
          return;
        }
      }
      const response = await fetch('/api/certification/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newRequest,
          farmerId: user.id,
          checkpoints: checkpointsToSend
        }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setSnackbar({
        open: true,
        message: 'Certification request submitted successfully!',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchRequests();
      window.location.reload()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setNewRequest((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handlePreviewImage = (url) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const handleCardClick = async (request) => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/certification/requests/${request.requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch request details');
      }

      const detailedRequest = await response.json();
      setSelectedRequest(detailedRequest);
      setFullScreenOpen(true);
    } catch (error) {
      console.error('Error fetching request details:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error fetching request details',
        severity: 'error'
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseFullScreen = () => {
    setFullScreenOpen(false);
    setSelectedRequest(null);
  };

  const handleRevert = async (requestId) => {
    setRevertLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Call your API to revert (e.g., set status to 'reverted')
      const response = await fetch(`http://localhost:5000/api/certification/revert/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to revert request');
      setSnackbar({ open: true, message: 'Request reverted successfully!', severity: 'success' });
      setFullScreenOpen(false);
      fetchRequests();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setRevertLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const resetForm = () => {
    setNewRequest(initialRequestState);
    setSelectedLocation(null);
    setShowMap(false);
  };

  const handleViewCertificate = async (requestId) => {
    setCertDetails(null);
    setCertDetailsLoading(true);
    setCertModalOpen(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/certification/dhiway-certificate/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch certificate details');
      const data = await res.json();
      setCertDetails(data.dhiwayResponse || data);
    } catch (err) {
      setCertDetails({ error: err.message });
    } finally {
      setCertDetailsLoading(false);
    }
  };

  const handleCheckpointFileUpload = async (file, checkpointId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('checkpointId', checkpointId);

    const res = await fetch('/api/certification/upload/checkpoint', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    // Save data.url in your checkpoint state for display
  };

  const handleCommonFileUpload = async (file, requestId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestId', requestId);

    const res = await fetch('/api/certification/upload/common', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    // Save data.url in your state for display
  };

  const handleRemoveMedia = async (mediaUrl, checkpointId) => {
    // Call backend to delete the file
    await fetch('/api/certification/delete-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ mediaUrl, checkpointId })
    });

    // Remove from state
    setNewRequest(prev => {
      const answers = [...prev.checkpointAnswers];
      answers[checkpointId - 1] = { ...answers[checkpointId - 1], media: null };
      return { ...prev, checkpointAnswers: answers };
    });
  };

  const columns = 4; // Number of columns per row

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <>
      {/* <NavBar /> */}
      <DashboardContainer maxWidth={false}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ width: '100%' }}
        >
          <StyledPaper>
            <HeaderSection>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Organic Certification Dashboard
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Manage your organic product certification requests
                </Typography>
              </Box>
              <ActionButtons>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    minWidth: { xs: '100%', sm: 'auto' },
                    height: '40px'
                  }}
                >
                  New Request
                </Button>
              </ActionButtons>
            </HeaderSection>

            <motion.div variants={itemVariants}>
              <BlockchainInfo>
                <Typography variant="h5" gutterBottom>
                  Blockchain-Powered Certification
                </Typography>
                <Typography variant="body1">
                  Your certification requests are securely stored on the blockchain,
                  ensuring transparency and immutability of your organic farming records.
                </Typography>
              </BlockchainInfo>
            </motion.div>
            <Box mb={2} display="flex" alignItems="center" gap={2}>
              <TextField
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="certified">Certified</MenuItem>
                <MenuItem value="reverted">Reverted</MenuItem>
              </TextField>
            </Box>
            <Grid container spacing={3} justifyContent="flex-start">
              {loading ? (
                <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </Grid>
              ) : requests.length === 0 ? (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: '15px',
                      background: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      No Certification Requests
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                      Start by creating a new certification request for your organic products.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Create First Request
                    </Button>
                  </Paper>
                </Grid>
              ) : (
                requests
                  .filter(request => statusFilter === 'all' ? true : request.status === statusFilter)
                  .map((request) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={request.requestId}>
                      <AtmCard>
                        <Box sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6" noWrap>{request.productName}</Typography>
                            <Chip
                              label={request.status}
                              sx={{
                                backgroundColor: statusColorMap[request.status]?.bg,
                                color: statusColorMap[request.status]?.color,
                                fontWeight: 600,
                                letterSpacing: 1,
                                textTransform: 'capitalize',
                              }}
                            />
                          </Box>
                          {request.blockchainTransactions && (
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Transaction Details:
                              </Typography>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(0,0,0,0.03)',
                                p: 1,
                                borderRadius: 1,
                                mb: 1
                              }}>
                                <Typography variant="caption" sx={{
                                  fontFamily: 'monospace',
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {request.blockchainTransactions.farmer.initiated}
                                </Typography>
                                <Box display="flex" gap={0.5}>
                                  <Tooltip title={copySuccess ? "Copied!" : "Copy to clipboard"}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(request.blockchainTransactions.farmer.initiated);
                                      }}
                                    >
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="View on blockchain explorer">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://sepolia.etherscan.io/tx/${request.blockchainTransactions.farmer.initiated}`, '_blank');
                                      }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                        <AtmCardContent>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(request);
                              }}
                              sx={{ mt: 1, ml: 1 }}
                              >
                              Request Details
                            </Button>
                            {request.status === 'certified' && (
                              <Button
                                variant="outlined"
                                color="info"
                                size="small"
                                onClick={() => handleViewCertificate(request.requestId)}
                                sx={{ mt: 1, ml: 1 }}
                              >
                                Certificate Details
                              </Button>
                            )}
                          </Box>
                        </AtmCardContent>
                      </AtmCard>
                    </Grid>
                  ))
              )}
            </Grid>
          </StyledPaper>
        </motion.div>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>New Certification Request</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} autocomplete="off" on>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="productName"
                    value={newRequest.productName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newRequest.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Checkpoints</Typography>
                  {[
                    { id: 1, label: "Is the land free from prohibited substances?", requiredMedia: true },
                    { id: 2, label: "Are organic seeds used?", requiredMedia: false },
                    { id: 3, label: "Is there a buffer zone?", requiredMedia: true },
                    { id: 4, label: "Is crop rotation practiced?", requiredMedia: false },
                    { id: 5, label: "Are synthetic fertilizers avoided?", requiredMedia: false },
                    { id: 6, label: "Is compost used?", requiredMedia: false },
                    { id: 7, label: "Are pesticides organic?", requiredMedia: true },
                    { id: 8, label: "Is irrigation water clean?", requiredMedia: false },
                    { id: 9, label: "Are records maintained?", requiredMedia: false },
                    { id: 10, label: "Is livestock managed organically?", requiredMedia: true },
                    { id: 11, label: "Is GMO use avoided?", requiredMedia: false },
                    { id: 12, label: "Are buffer zones marked?", requiredMedia: true },
                    { id: 13, label: "Is soil tested regularly?", requiredMedia: false },
                    { id: 14, label: "Are weeds managed organically?", requiredMedia: false },
                    { id: 15, label: "Is manure composted?", requiredMedia: false },
                    { id: 16, label: "Are organic certificates displayed?", requiredMedia: true },
                    { id: 17, label: "Is equipment cleaned before use?", requiredMedia: false },
                    { id: 18, label: "Are storage areas separate?", requiredMedia: true },
                    { id: 19, label: "Is packaging eco-friendly?", requiredMedia: false },
                    { id: 20, label: "Are transport vehicles clean?", requiredMedia: true },
                  ].map((cp, idx) => (
                    <Box key={cp.id} mb={2} p={2} border="1px solid #eee" borderRadius={2}>
                      <Typography>{cp.label}</Typography>
                      <Button
                        variant={newRequest.checkpointAnswers[idx]?.answer === 'yes' ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => {
                          setNewRequest(prev => {
                            const answers = [...prev.checkpointAnswers];
                            answers[idx] = { ...answers[idx], answer: 'yes' };
                            return { ...prev, checkpointAnswers: answers };
                          });
                        }}
                        sx={{ mr: 1 }}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={newRequest.checkpointAnswers[idx]?.answer === 'no' ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => {
                          setNewRequest(prev => {
                            const answers = [...prev.checkpointAnswers];
                            answers[idx] = { ...answers[idx], answer: 'no' };
                            return { ...prev, checkpointAnswers: answers };
                          });
                        }}
                      >
                        No
                      </Button>
                      {cp.requiredMedia && newRequest.checkpointAnswers[idx]?.answer === 'yes' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          <label>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // Upload to backend
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('checkpointId', cp.id);
                                  const res = await fetch('/api/certification/upload/checkpoint', {
                                    method: 'POST',
                                    body: formData,
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                  });
                                  const data = await res.json();
                                  setNewRequest(prev => {
                                    const answers = [...prev.checkpointAnswers];
                                    answers[idx] = { ...answers[idx], media: data.url };
                                    return { ...prev, checkpointAnswers: answers };
                                  });
                                }
                              }}
                            />
                            <Button variant="outlined" component="span">
                              Upload Media
                            </Button>
                          </label>
                          {newRequest.checkpointAnswers[idx]?.media && (
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                src={newRequest.checkpointAnswers[idx].media}
                                alt="Checkpoint media"
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: -8,
                                  right: -8,
                                  background: 'white',
                                  border: '1px solid #ccc'
                                }}
                                onClick={() => handleRemoveMedia(newRequest.checkpointAnswers[idx].media, cp.id)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<MyLocationIcon />}
                      onClick={handleGetCurrentLocation}
                      fullWidth
                      sx={{ flex: 1 }}
                    >
                      Use Current Location
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MapIcon />}
                      onClick={() => setShowMap(!showMap)}
                      fullWidth
                      sx={{ flex: 1 }}
                    >
                      {showMap ? 'Hide Map' : 'Select on Map'}
                    </Button>
                  </Box>
                </Grid>
                {showMap && (
                  <Grid item xs={12}>
                    <Box sx={{ height: '300px', mb: 2 }}>
                      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={selectedLocation || { lat: 20.5937, lng: 78.9629 }}
                          zoom={10}
                          onClick={handleMapClick}
                        >
                          {selectedLocation && (
                            <Marker position={selectedLocation} />
                          )}
                        </GoogleMap>
                      </LoadScript>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location Coordinates"
                    value={selectedLocation ? `${selectedLocation.lat}, ${selectedLocation.lng}` : ''}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Complete Address"
                    name="address"
                    value={newRequest.location.address}
                    onChange={handleLocationChange}
                    required
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="contained" component="span" fullWidth>
                      Upload Images
                    </Button>
                  </label>
                  {newRequest.images.length > 0 && (
                    <ImagePreviewContainer>
                      {newRequest.images.map((img, idx) => (
                        <div key={idx} className="preview-image-container">
                          <img
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                            onClick={() => handlePreviewImage(img)}
                          />
                          <IconButton
                            size="small"
                            sx={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.7)' }}
                            onClick={() => handleRemoveImage(idx)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(255,255,255,0.7)' }}
                            onClick={() => handlePreviewImage(img)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ))}
                    </ImagePreviewContainer>
                  )}
                </Grid> */}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Request'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md">
          <DialogContent sx={{ p: 0 }}>
            {previewImage && (
              <img src={previewImage} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={fullScreenOpen}
          onClose={handleCloseFullScreen}
          fullScreen
          maxWidth="md"
        >
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            padding: '16px 24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">{selectedRequest?.productName}</Typography>
              <Chip
                label={selectedRequest?.status}
                sx={{
                  backgroundColor: statusColorMap[selectedRequest?.status]?.bg,
                  color: statusColorMap[selectedRequest?.status]?.color,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'capitalize',
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Copy Request ID">
                <IconButton
                  size="small"
                  onClick={() => navigator.clipboard.writeText(selectedRequest?.id)}
                  sx={{ color: 'white' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="close"
                onClick={handleCloseFullScreen}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
            {loadingDetails ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: '400px'
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : selectedRequest ? (
              <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                  {/* Product Details Card */}
                  <Paper sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <InfoIcon /> Product Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                          <strong>Description:</strong> {selectedRequest.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" paragraph>
                          <strong>Location:</strong> {selectedRequest.location?.address || 'No address provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {selectedRequest.location?.latitude && selectedRequest.location?.longitude && (
                          <Typography variant="body1" paragraph>
                            <strong>Coordinates:</strong> {selectedRequest.location.latitude}, {selectedRequest.location.longitude}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<MapIcon />}
                            onClick={() => window.open(`https://www.google.com/maps?q=${selectedRequest.location?.latitude},${selectedRequest.location?.longitude}`, '_blank')}
                          >
                            View on Google Maps
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Images Section */}
                  {/* <Paper sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <PhotoLibraryIcon /> Media
                    </Typography>
                    {selectedRequest.images && selectedRequest.images.length > 0 ? (
                      <Grid container spacing={2}>
                        {selectedRequest.images.map((img, idx) => (
                          <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Box
                              sx={{
                                position: 'relative',
                                paddingTop: '75%',
                                cursor: 'pointer',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                  '& .overlay': {
                                    opacity: 1
                                  },
                                  '& .image': {
                                    transform: 'scale(1.05)'
                                  }
                                }
                              }}
                              onClick={() => handlePreviewImage(img)}
                            >
                              <img
                                className="image"
                                src={img}
                                alt={`Product ${idx + 1}`}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease'
                                }}
                              />
                              <Box
                                className="overlay"
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.3s'
                                }}
                              >
                                <ZoomInIcon sx={{ color: 'white', fontSize: 40 }} />
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2
                      }}>
                        <PhotoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="textSecondary">No media uploaded</Typography>
                      </Box>
                    )}
                  </Paper> */}

                  {/* Checkpoints Section */}
                  <Paper sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <ChecklistIcon /> Checkpoint Responses
                    </Typography>
                    <Table>
                      <TableBody>
                        {chunkArray(selectedRequest.checkpoints || [], columns).map((row, rowIdx) => (
                          <TableRow key={rowIdx}>
                            {row.map((cp, idx) => (
                              <TableCell key={cp.id} sx={{ border: 'none', p: 1, verticalAlign: 'top' }}>
                                <Box
                                  sx={{
                                    p: 2,
                                    height: 180,
                                    minWidth: 220,
                                    maxWidth: 300,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderRadius: 2,
                                    border: '2px solid',
                                    borderColor:
                                      cp.answer === 'yes'
                                        ? 'success.light'
                                        : cp.answer === 'no'
                                        ? 'error.light'
                                        : 'divider',
                                    boxShadow: cp.answer === 'yes'
                                      ? '0 0 8px 0 #43a04733'
                                      : cp.answer === 'no'
                                      ? '0 0 8px 0 #e5393533'
                                      : 'none',
                                    overflow: 'hidden',
                                    background: '#fafbfc'
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                      fontWeight: 600,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                    title={checkpointQuestions[cp.checkpointId - 1] || `Checkpoint ${cp.checkpointId}`}
                                  >
                                    {checkpointQuestions[cp.checkpointId - 1] || `Checkpoint ${cp.checkpointId}`}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      Answer:
                                    </Typography>
                                    <Chip
                                      label={cp.answer || 'Not answered'}
                                      color={
                                        cp.answer === 'yes'
                                          ? 'success'
                                          : cp.answer === 'no'
                                          ? 'error'
                                          : 'default'
                                      }
                                      size="small"
                                      sx={{ fontWeight: 'bold' }}
                                    />
                                  </Box>
                                  {cp.mediaUrl && (
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                      <img
                                        src={cp.mediaUrl}
                                        alt={`Checkpoint ${cp.checkpointId} media`}
                                        style={{
                                          width: 80,
                                          height: 60,
                                          objectFit: 'cover',
                                          borderRadius: 4,
                                          border: '1px solid #eee',
                                          display: 'inline-block',
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                          setGalleryImage(cp.mediaUrl);
                                          setGalleryOpen(true);
                                        }}
                                      />
                                      <Button
                                        variant="text"
                                        size="small"
                                        sx={{ mt: 1 }}
                                        onClick={() => {
                                          setGalleryImage(cp.mediaUrl);
                                          setGalleryOpen(true);
                                        }}
                                      >
                                        Preview
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                            ))}
                            {/* Fill empty cells if needed for alignment */}
                            {row.length < columns &&
                              Array.from({ length: columns - row.length }).map((_, i) => (
                                <TableCell key={`empty-${i}`} sx={{ border: 'none' }} />
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                  {/* Request Information */}
                  <Paper sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <PersonIcon /> Request Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem'
                      }}>
                        {selectedRequest.farmer?.username?.[0]?.toUpperCase() || 'F'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">Farmer</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {selectedRequest.farmer?.username || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                    {selectedRequest.inspector && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'secondary.main',
                          fontSize: '1.2rem'
                        }}>
                          {selectedRequest.inspector.username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Inspector</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {selectedRequest.inspector.username}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {selectedRequest.certifier && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'success.main',
                          fontSize: '1.2rem'
                        }}>
                          {selectedRequest.certifier.username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Certifier</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {selectedRequest.certifier.username}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Paper>

                  {/* Timeline */}
                  <Paper sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}>
                    <Typography variant="h6" gutterBottom sx={{
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <TimelineIcon /> Request Timeline
                    </Typography>
                    <Box sx={{ position: 'relative', pl: 3 }}>
                      <Box sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: 'divider'
                      }} />
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{
                          position: 'absolute',
                          left: -6,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          border: '2px solid white',
                          boxShadow: '0 0 0 2px primary.main'
                        }} />
                        <Typography variant="body2" color="textSecondary">Request Created</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(selectedRequest.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      {selectedRequest.updatedAt && (
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{
                            position: 'absolute',
                            left: -6,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: 'secondary.main',
                            border: '2px solid white',
                            boxShadow: '0 0 0 2px secondary.main'
                          }} />
                          <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(selectedRequest.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>

                  {/* Blockchain Info */}
                  {selectedRequest.blockchainTransactionId && (
                    <Paper sx={{
                      p: 3,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      background: 'white'
                    }}>
                      <Typography variant="h6" gutterBottom sx={{
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <SecurityIcon /> Blockchain Information
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        {/* Transaction ID */}
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Transaction ID
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                              {selectedRequest.blockchainTransactionId}
                            </Typography>
                            <Tooltip title="Copy Transaction ID">
                              <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(selectedRequest.blockchainTransactionId)}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Transaction Status */}
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Transaction Status
                          </Typography>
                          <Chip
                            label="Confirmed"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        {/* Block Information */}
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Block Information
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Block Number:
                              </Typography>
                              <Typography variant="body2">
                                {selectedRequest.blockNumber || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Gas Used:
                              </Typography>
                              <Typography variant="body2">
                                {selectedRequest.gasUsed || 'N/A'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Transaction Details */}
                        <Box sx={{
                          p: 2,
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Transaction Details
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                From:
                              </Typography>
                              <Typography variant="body2" noWrap>
                                {selectedRequest.fromAddress || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                To:
                              </Typography>
                              <Typography variant="body2" noWrap>
                                {selectedRequest.toAddress || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                Value:
                              </Typography>
                              <Typography variant="body2">
                                {selectedRequest.value || '0 ETH'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* View on Explorer Button */}
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<OpenInNewIcon />}
                          onClick={() => window.open(`https://etherscan.io/tx/${selectedRequest.blockchainTransactionId}`, '_blank')}
                          sx={{ mt: 1 }}
                        >
                          View on Etherscan
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions sx={{
            p: 2,
            backgroundColor: '#f5f7fa',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            {selectedRequest && selectedRequest.status === 'pending' && (
              <Button
                color="error"
                variant="contained"
                onClick={() => handleRevert(selectedRequest.id)}
                startIcon={<UndoIcon />}
                sx={{
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: 'error.dark'
                  }
                }}
                disabled={revertLoading}
              >
                {revertLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Revert Request'
                )}
              </Button>
            )}
            <Button
              onClick={handleCloseFullScreen}
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{ minWidth: 120 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <CertificateDetailsModal
          open={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          certDetails={certDetails}
          loading={certDetailsLoading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog open={galleryOpen} onClose={() => setGalleryOpen(false)} maxWidth="sm">
          <DialogTitle>
            Checkpoint Media Preview
            <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 1 }}>
              {galleryImage && (
                <IconButton
                  aria-label="download"
                  component="a"
                  href={galleryImage}
                  download
                  sx={{ color: 'inherit' }}
                >
                  <DownloadIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="close"
                onClick={() => setGalleryOpen(false)}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {galleryImage ? (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <img
                  src={galleryImage}
                  alt="Checkpoint Media"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
              </Box>
            ) : (
              <Typography>No media available.</Typography>
            )}
          </DialogContent>
        </Dialog>
      </DashboardContainer>
    </>
  );
};

export default FarmerDashboard;