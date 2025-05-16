import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Grid, Card, CardContent, CardMedia, Chip, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Avatar, Tooltip, Fade, Snackbar, Alert, TextField, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavBar from '../../components/NavBar';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  reverted: 'default',
  in_progress: 'info',
  certified: 'info',
};

const statusIcons = {
  pending: <PendingIcon color="warning" sx={{ verticalAlign: 'middle' }} />,
  approved: <CheckCircleIcon color="success" sx={{ verticalAlign: 'middle' }} />,
  rejected: <CancelIcon color="error" sx={{ verticalAlign: 'middle' }} />,
  in_progress: <AssignmentTurnedInIcon color="info" sx={{ verticalAlign: 'middle' }} />,
  certified: <CheckCircleIcon color="info" sx={{ verticalAlign: 'middle' }} />,
  reverted: <CancelIcon color="default" sx={{ verticalAlign: 'middle' }} />,
};

const statusColorMap = {
  pending: { bg: '#ffb300', color: '#fff' }, // Amber
  in_progress: { bg: '#1976d2', color: '#fff' }, // Blue
  approved: { bg: '#43a047', color: '#fff' }, // Green
  certified: { bg: '#00897b', color: '#fff' }, // Teal
  rejected: { bg: '#e53935', color: '#fff' }, // Red
  reverted: { bg: '#757575', color: '#fff' }, // Grey
};

const InspectorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/certification/inspection/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (req) => {
    setSelectedRequest(req);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;

    try {
      setStatusLoading(newStatus);
      const token = localStorage.getItem('token');

      // Validate status transition
      if (newStatus === 'approved' && selectedRequest.status !== 'in_progress') {
        throw new Error('Request must be in progress before it can be approved');
      }

      // Different endpoints for different status changes
      const endpoint = newStatus === 'in_progress'
        ? `/api/certification/inspect/${selectedRequest.requestId}/status`
        : `/api/certification/inspect/${selectedRequest.requestId}`;

      // Different request bodies for different status changes
      const body = newStatus === 'in_progress'
        ? { status: 'in_progress' }
        : { approved: newStatus === 'approved' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update status');
      }

      const data = await response.json();

      // Update the selected request with new blockchain transaction data
      if (data.blockchainResult?.transactionHash) {
        setSelectedRequest(prev => {
          // Copy previous inspector transactions
          const prevInspector = { ...(prev.blockchainTransactions?.inspector || {}) };
          // Update only the relevant field
          if (newStatus === 'approved') {
            prevInspector.approved = data.blockchainResult.transactionHash;
          } else if (newStatus === 'rejected') {
            prevInspector.rejected = data.blockchainResult.transactionHash;
          } else if (newStatus === 'in_progress') {
            prevInspector.in_progress = data.blockchainResult.transactionHash;
          }
          return {
            ...prev,
            status: newStatus,
            blockchainTransactions: {
              ...prev.blockchainTransactions,
              inspector: prevInspector
            }
          };
        });
      }

      setSnackbar({
        open: true,
        message: `Request ${newStatus} successfully`,
        severity: 'success'
      });

      setDialogOpen(false);
      fetchRequests();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update status',
        severity: 'error'
      });
    } finally {
      setStatusLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <>
      {/* <NavBar /> */}
      <Box minHeight="100vh" p={0} bgcolor="#f5f7fa">
        {/* Header */}
        <Box sx={{
          width: '100%',
          py: 5,
          background: 'linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)',
          color: 'white',
          mb: 4,
          boxShadow: 3,
          textAlign: 'center',
        }}>
          <AssignmentTurnedInIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Inspector Dashboard
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)">
            Review and inspect farmer certification requests
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1300, margin: '0 auto', borderRadius: 4, background: 'rgba(255,255,255,0.97)' }}>
          {/* --- FILTER DROPDOWN --- */}
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
          {/* --- END FILTER DROPDOWN --- */}
          {loading ? (
            <Box textAlign="center" mt={4}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={4}>
              {requests.length === 0 ? (
                <Grid item xs={12}>
                  <Typography>No requests found.</Typography>
                </Grid>
              ) : (
                requests
                  .filter(req => statusFilter === 'all' ? true : req.status === statusFilter)
                  .map((req) => (
                    <Grid item xs={12} sm={6} md={4} key={req.requestId}>
                      <Fade in timeout={600}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            boxShadow: 6,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-6px) scale(1.03)',
                              boxShadow: 12,
                            },
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)',
                          }}
                          onClick={() => handleCardClick(req)}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="160"
                              image={req.images && req.images.length > 0 ? req.images[0] : 'https://via.placeholder.com/350x160?text=No+Image'}
                              alt={req.productName}
                              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
                            />
                            <Chip
                              label={req.status}
                              sx={{
                                backgroundColor: statusColorMap[req.status]?.bg,
                                color: statusColorMap[req.status]?.color,
                                fontWeight: 600,
                                letterSpacing: 1,
                                textTransform: 'capitalize',
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                fontSize: 16,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                boxShadow: 2,
                              }}
                              // icon={statusIcons[req.status]}
                            />
                          </Box>
                          <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>{req.productName}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {req.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <PersonIcon fontSize="small" color="primary" />
                              <Typography variant="body2" color="textSecondary">
                                Farmer: {req.farmerName || req.farmerId}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocationOnIcon fontSize="small" color="secondary" />
                              <Typography variant="body2" color="textSecondary">
                                Location: {req.location?.address || 'N/A'}
                              </Typography>
                            </Box>
                            {req.status === 'rejected' && (
                              <Typography color="error" variant="body2" mt={1}>
                                Rejected by {req.inspectorId}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))
              )}
            </Grid>
          )}
        </Paper>
        {/* Dialog for request details and actions */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ background: 'linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)', color: 'white', pb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <AssignmentTurnedInIcon fontSize="large" />
              <Typography variant="h5" fontWeight={700}>Request Details</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
              sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)' }}>
            {selectedRequest && (
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>{selectedRequest.productName}</Typography>
                <Typography mb={1}><strong>Description:</strong> {selectedRequest.description}</Typography>
                <Typography mb={1}><strong>Status:</strong> <Chip label={selectedRequest.status} color={statusColors[selectedRequest.status] || 'default'} icon={statusIcons[selectedRequest.status]} /></Typography>
                <Typography mb={1}><strong>Request ID:</strong> {selectedRequest.requestId}</Typography>
                <Typography mb={1}><strong>Blockchain Request ID:</strong> {selectedRequest.blockchainRequestId || 'N/A'}</Typography>
                <Typography mb={1}><strong>Farmer ID:</strong> {selectedRequest.farmerId}</Typography>
                <Typography mb={1}><strong>Inspector ID:</strong> {selectedRequest.inspectorId || 'N/A'}</Typography>
                <Typography mb={2}><strong>Certifier ID:</strong> {selectedRequest.certifierId || 'N/A'}</Typography>

                {/* Blockchain Transactions */}
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight={500} mb={1}>
                    Blockchain Transactions
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                    {Object.entries(selectedRequest.blockchainTransactions || {}).map(([role, txs]) => (
                      <Box key={role} mb={1}>
                        <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>{role}:</Typography>
                        {Object.entries(txs || {}).map(([status, hash]) => (
                          <Box key={status} display="flex" alignItems="center" gap={1} ml={2}>
                            <Typography variant="body2" fontWeight={500}>{status}:</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {hash || 'No transaction'}
                            </Typography>
                            {hash && (
                              <>
                                <Tooltip title="Copy transaction hash">
                                  <IconButton size="small" onClick={() => copyToClipboard(hash)}>
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View on blockchain explorer">
                                  <IconButton size="small" onClick={() => window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank')}>
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Paper>
                </Box>

                {/* Media */}
                {selectedRequest.images && selectedRequest.images.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight={500} mb={1}><ImageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Product Images</Typography>
                    <Stack direction="row" spacing={2}>
                      {selectedRequest.images.map((img, idx) => (
                        <img key={idx} src={img} alt="media" style={{ maxWidth: 180, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Checkpoints */}
                {selectedRequest.checkpoints && selectedRequest.checkpoints.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight={500} mb={1}>Checkpoints</Typography>
                    <Stack spacing={2}>
                      {selectedRequest.checkpoints.map((cp, idx) => (
                        <Paper key={idx} sx={{ p: 2, borderRadius: 2, background: '#f4f8fb' }}>
                          <Typography><strong>Checkpoint ID:</strong> {cp.checkpointId}</Typography>
                          <Typography><strong>Answer:</strong> {cp.answer}</Typography>
                          {cp.mediaUrl && (
                            <img src={cp.mediaUrl} alt="checkpoint media" style={{ maxWidth: 120, borderRadius: 6, marginTop: 8 }} />
                          )}
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
                {/* Action buttons */}
                {["certified", "reverted", "approved", "rejected"].includes(selectedRequest.status) ? (
                  <Box mt={3}>
                    <Alert severity={
                      selectedRequest.status === "certified" || selectedRequest.status === "approved"
                        ? "success"
                        : selectedRequest.status === "reverted"
                          ? "warning"
                          : "error"
                    }>
                      {selectedRequest.status === "certified" && "Certificate has been issued successfully."}
                      {selectedRequest.status === "reverted" && "This request has been reverted by the Initiator."}
                      {selectedRequest.status === "approved" && "This request has been approved successfully."}
                      {selectedRequest.status === "rejected" && "This request has been rejected."}
                    </Alert>
                  </Box>
                ) : (
                  <Stack direction="row" spacing={2} mt={3}>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleStatusChange('in_progress')}
                      disabled={
                        !!statusLoading || selectedRequest?.status === 'in_progress'
                      }
                      sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
                    >
                      {statusLoading === 'in_progress' ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                          Mark In Progress
                        </>
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange('approved')}
                      disabled={
                        !!statusLoading || selectedRequest?.status !== 'in_progress'
                      }
                      sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
                    >
                      {statusLoading === 'approved' ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <CheckCircleIcon sx={{ mr: 1 }} />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusChange('rejected')}
                      disabled={
                        !!statusLoading || selectedRequest?.status !== 'in_progress'
                      }
                      sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
                    >
                      {statusLoading === 'rejected' ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <CancelIcon sx={{ mr: 1 }} />
                          Reject
                        </>
                      )}
                    </Button>
                  </Stack>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
      {/* Add Snackbar for notifications */}
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

      {/* Add Snackbar for copy success */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Transaction hash copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default InspectorDashboard;