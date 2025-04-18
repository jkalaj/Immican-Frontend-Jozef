import React, { useRef, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { fileUpload } from "../../../../../api/FetchData"; // Import your fileUpload function

const InstructionWithFileUpload = ({ instructions, fileUploadLabels, reloadData }) => {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileChange = async (event, uploadType) => {
    const selectedFile = event.target.files[0];

    // Check file size based on the upload type
    const maxFileSize = 157286400;

    if (selectedFile.size > maxFileSize) {
      // Show error message if file size exceeds the limit
      alert(`File size exceeds the limit (${maxFileSize / (1024 * 1024)} MB). Please upload a smaller file.`);
    } else {
      // Call fileUpload to save the file
      try {
        const options = {
          document_type: uploadType.replace(/\s/g, '_').replace(/^/, 'business_'), 
          document_data: selectedFile,
        };

        setUploading(true);
        setUploadPercentage(0);

        // Pass the setUploadPercentage function as a callback to track progress
        await fileUpload('user/uploadDocuments', options, (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadPercentage(percentage);
        });

        console.log('File saved successfully');
        // Fetch data or update state if needed
      } catch (error) {
        console.error('Error saving file:', error);
      } finally {
        setUploading(false);
        setUploadPercentage(0);
        reloadData();
      }
    }
  };


  return (
    <Card sx={{ textAlign: 'center', maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, textAlign: 'left' }}>
          {instructions}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, textAlign: 'left' }}>
          1. Please upload a story of yourself within 30sec.<br></br>
          2. File size must be within 150mb.
        </Typography>
        <List sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}>
        {uploading && (
        <ListItem>
          <LinearProgress variant="determinate" value={uploadPercentage} sx={{ width: '100%' }} />
        </ListItem>
      )}
          {fileUploadLabels.map((label, index) => (
            <ListItem key={index} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}>
              <label htmlFor={`fileInput${index}`} style={{ width: '100%' }}>
                <input
                  ref={fileInputRef}
                  id={`fileInput${index}`}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(event) => handleFileChange(event, label.toLowerCase())}
                />
                <ListItemText sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }} primary={`Click to Upload ${label}`} />
              </label>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default InstructionWithFileUpload;
