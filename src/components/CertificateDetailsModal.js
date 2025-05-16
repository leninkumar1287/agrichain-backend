import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Button, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { CertificateDetailsTable } from './CertificateDetailsTable'; // Import your table component

const CertificateDetailsModal = ({
  open,
  onClose,
  certDetails
}) => {
  // Prepare explorer URL if blockHash exists
  const explorerUrl = certDetails?.blockHash
    ? `https://explorer.dway.io/?rpc=wss://royal-blue.dway.io#/explorer/query/${certDetails.blockHash}`
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Issued Certificate Details</span>
        <Box>
          {certDetails?.pdfUrl && (
            <Button
              variant="contained"
              color="primary"
              href={certDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ mr: 2 }}
            >
              Download PDF
            </Button>
          )}
          {explorerUrl && (
            <Button
              variant="outlined"
              color="secondary"
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<LinkIcon />}
              sx={{ mr: 2 }}
            >
              View on Explorer
            </Button>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <CertificateDetailsTable certDetails={certDetails} />
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDetailsModal;