import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PdfViewer = ({ open, handleClose, pdfUrl }) => {

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>PDF Viewer</DialogTitle>
      <DialogContent>
        <iframe
          src={`${pdfUrl}`}
          title="PDF Viewer"
          style={{ width: '100%', height: '600px', border: 'none' }}
        ></iframe>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PdfViewer;
