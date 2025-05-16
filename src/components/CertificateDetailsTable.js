import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, Chip, Button, Link as MuiLink, Box, Typography, Tooltip, IconButton, CircularProgress
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
    return value.length === 0 ? null :
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

export function CertificateDetailsTable({ certDetails }) {
  if (!certDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table size="small">
        <TableBody>
          {Object.entries(certDetails).map(([key, value]) =>
            !isEmpty(value) && (
              <TableRow key={key}>
                <TableCell sx={{ fontWeight: 600, width: 220 }}>{humanizeKey(key)}</TableCell>
                <TableCell sx={{ wordBreak: 'break-all' }}>{renderTableCell(key, value)}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
