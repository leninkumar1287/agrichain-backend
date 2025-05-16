import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Chip, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Dialog, DialogTitle, DialogContent, IconButton, Stack, Link as MuiLink, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CertificateDetailsModal from '../../components/CertificateDetailsModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';

const statusColorMap = {
  pending:    { bg: '#ffb300', color: '#fff' }, // Amber
  in_progress:{ bg: '#1976d2', color: '#fff' }, // Blue
  approved:   { bg: '#43a047', color: '#fff' }, // Green
  certified:  { bg: '#00897b', color: '#fff' }, // Teal
  rejected:   { bg: '#e53935', color: '#fff' }, // Red
  reverted:   { bg: '#757575', color: '#fff' }, // Grey
};

function humanizeKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function isEmpty(val) {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (isObject(val) && Object.keys(val).length === 0) return true;
  return false;
}

function CopyableValue({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ wordBreak: 'break-all' }}>{value}</span>
      <Tooltip title={copied ? "Copied!" : "Copy"}>
        <IconButton size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </span>
  );
}

function renderTableCell(key, value) {
  // PDF link
  if (key.toLowerCase().includes('pdf') && typeof value === 'string' && value.startsWith('http')) {
    return (
      <Button
        variant="contained"
        color="primary"
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        startIcon={<PictureAsPdfIcon />}
        sx={{ wordBreak: 'break-all' }}
      >
        Download PDF
      </Button>
    );
  }
  // Image preview
  if ((key.toLowerCase().includes('image') || /\.(jpg|jpeg|png|gif)$/i.test(value)) && typeof value === 'string' && value.startsWith('http')) {
    return (
      <img src={value} alt={key} style={{ maxWidth: 120, borderRadius: 8 }} />
    );
  }
  // QR code
  if (key.toLowerCase().includes('qr') && typeof value === 'string' && value.startsWith('http')) {
    return (
      <Box>
        <img src={value} alt="QR Code" style={{ maxWidth: 80, marginBottom: 4 }} />
        <MuiLink href={value} target="_blank" rel="noopener noreferrer" sx={{ ml: 2, wordBreak: 'break-all' }}>
          Open QR Link
        </MuiLink>
      </Box>
    );
  }
  // General link
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <MuiLink href={value} target="_blank" rel="noopener noreferrer" sx={{ wordBreak: 'break-all' }}>
        {value}
      </MuiLink>
    );
  }
  // Boolean as chip
  if (typeof value === 'boolean') {
    return (
      <Chip
        label={value ? 'True' : 'False'}
        color={value ? 'success' : 'default'}
        size="small"
      />
    );
  }
  // Date/time
  if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
    return value ? new Date(value).toLocaleString() : 'N/A';
  }
  // Nested object
  if (isObject(value)) {
    return (
      <Table size="small" sx={{ background: "#f8fafc", mb: 1 }}>
        <TableBody>
          {Object.entries(value).map(([k, v]) =>
            !isEmpty(v) && (
              <TableRow key={k}>
                <TableCell sx={{ fontWeight: 500, width: 120 }}>{humanizeKey(k)}</TableCell>
                <TableCell sx={{ wordBreak: 'break-all' }}>{renderTableCell(k, v)}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  }
  // Array
  if (Array.isArray(value)) {
    return value.length === 0 ? <Typography color="text.secondary">[empty]</Typography> :
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {value.map((v, i) => <li key={i}>{typeof v === 'object' ? JSON.stringify(v) : v}</li>)}
      </ul>;
  }
  // If key is id/hash/publicId, show copy icon
  if (
    /id|hash/i.test(key) &&
    typeof value === 'string' &&
    value.length > 6 // avoid copying "True"/"False"
  ) {
    return <CopyableValue value={value} />;
  }
  // Default: show as text
  return <span style={{ wordBreak: 'break-all' }}>{String(value)}</span>;
}

// export function CertificateDetailsTable({ certDetails }) {
//   if (!certDetails) return <Typography>No certificate details available.</Typography>;
//   return (
//     <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
//       <Table size="small">
//         <TableBody>
//           {Object.entries(certDetails).map(([key, value]) =>
//             !isEmpty(value) && (
//               <TableRow key={key}>
//                 <TableCell sx={{ fontWeight: 600, width: 220 }}>{humanizeKey(key)}</TableCell>
//                 <TableCell sx={{ wordBreak: 'break-all' }}>{renderTableCell(key, value)}</TableCell>
//               </TableRow>
//             )
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

const CertifierDashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [certDetails, setCertDetails] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certDetailsLoading, setCertDetailsLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null); // null or 'in_progress' | 'approved' | 'rejected'
  const [issueLoadingId, setIssueLoadingId] = useState(null); // Holds the requestId being issued
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/certification/issuer/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  const handleIssueCertificate = async (requestId) => {
    setIssueLoadingId(requestId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certification/certify/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to issue certificate');
      setSnackbar({ open: true, message: 'Certificate issued successfully!', severity: 'success' });
      fetchRequests();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIssueLoadingId(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;
    try {
      setStatusLoading(newStatus); // Set to the action string
      // ... your async logic ...
    } catch (err) {
      // ... error handling ...
    } finally {
      setStatusLoading(null); // Reset after done
    }
  };

  // Filtering and searching
  const filteredRequests = requests.filter(req => {
    const matchesStatus = filter === 'all' || req.status === filter;
    const matchesSearch =
      req.productName?.toLowerCase().includes(search.toLowerCase()) ||
      req.farmer?.username?.toLowerCase().includes(search.toLowerCase()) ||
      req.inspector?.username?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle opening/closing the details dialog
  const handleOpenDialog = (req) => {
    setSelectedRequest(req);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Certificate Issuer Dashboard
              </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <TextField
          label="Search"
          variant="outlined"
                          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <TextField
          select
          label="Status"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="certified">Certified</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
                      </Box>
      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Inspector</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.requestId}>
                    <TableCell>{req.productName}</TableCell>
                    <TableCell>{req.farmer?.username || 'N/A'}</TableCell>
                    <TableCell>{req.inspector?.username || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={req.status}
                        color={statusColorMap[req.status]?.bg}
                        sx={{
                          backgroundColor: statusColorMap[req.status]?.bg,
                          color: statusColorMap[req.status]?.color,
                          fontWeight: 600,
                          letterSpacing: 1,
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(req)}
                        sx={{ mr: 1 }}
                      >
                        View Details
                      </Button>
                      {req.status === 'certified' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={() => handleViewCertificate(req.requestId)}
                        >
                          View Issued Certificate Details
                        </Button>
                      )}
                      {req.status === 'approved' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleIssueCertificate(req.requestId)}
                          disabled={issueLoadingId === req.requestId}
                          sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
                        >
                          {issueLoadingId === req.requestId ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            'Issue Certificate' 
                          )}
                        </Button>
                      )}
                      &nbsp;&nbsp;
                      {req.status === 'certified' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            backgroundColor: '#2ecc40',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#2ecc40',
                            },
                            fontWeight: 600,
                            letterSpacing: 1,
                            pointerEvents: 'none',
                            opacity: 1,
                            cursor: 'default',
                          }}
                        >
                          Certified
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)', color: 'white' }}>
          Request Details
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)' }}>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>{selectedRequest.productName}</Typography>
              <Typography mb={1}><strong>Description:</strong> {selectedRequest.description}</Typography>
              <Typography mb={1}><strong>Status:</strong> <Chip label={selectedRequest.status} color={statusColorMap[selectedRequest.status]?.bg} sx={{ backgroundColor: statusColorMap[selectedRequest.status]?.bg, color: statusColorMap[selectedRequest.status]?.color, fontWeight: 600, letterSpacing: 1, textTransform: 'capitalize' }} /></Typography>
              <Typography mb={1}><strong>Farmer:</strong> {selectedRequest.farmer?.username || selectedRequest.farmerId}</Typography>
              <Typography mb={1}><strong>Inspector:</strong> {selectedRequest.inspector?.username || selectedRequest.inspectorId || 'N/A'}</Typography>
              <Typography mb={1}><strong>Created At:</strong> {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'N/A'}</Typography>
              {/* Add more fields as needed */}
              {/* Show images if available */}
              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight={500} mb={1}>Product Images</Typography>
                  <Stack direction="row" spacing={2}>
                    {selectedRequest.images.map((img, idx) => (
                      <img key={idx} src={img} alt="media" style={{ maxWidth: 120, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
          </DialogContent>
        </Dialog>

      {/* Issued Certificate Details Modal */}
      <CertificateDetailsModal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        certDetails={certDetails}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
      </Box>
  );
};

export default CertifierDashboard; 