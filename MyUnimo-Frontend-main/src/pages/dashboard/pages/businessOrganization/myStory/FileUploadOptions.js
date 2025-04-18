import React, { useRef, useEffect, useState } from 'react';
import { List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { fileUpload } from "../../../../../api/FetchData"; // Import your fileUpload function

const FileUploadOptions = ({ onCancel, labels, maxImageSize, maxVideoSize, reloadData  }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileChange = async (event, uploadType) => {
    const selectedFile = event.target.files[0];

    // Check file size based on the upload type
    const maxFileSize = uploadType === 'profile picture' ? maxImageSize : maxVideoSize;

    if (selectedFile.size > maxFileSize) {
      // Show error message if file size exceeds the limit
      alert(`File size exceeds the limit (${maxFileSize / (1024 * 1024)} MB). Please upload a smaller file.`);
    } else {
      // Call fileUpload to save the file
      try {
        const options = {
          document_type: uploadType.replace(/\s/g, '_').replace(/^/, 'business_'), // Assuming your API expects a document_type for profile_pictures and stories
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

  useEffect(() => {
    const handleBodyClick = (event) => {
      const isInsideOptions = event.target.closest('#fileUploadOptions');
      if (!isInsideOptions) {
        onCancel();
      }
    };

    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [onCancel]);

  return (
    <List
      id="fileUploadOptions"
      style={{
        position: 'absolute',
        top: '90%', // Adjust this value as needed
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)',
        zIndex: 101,
        width: '60%', // Adjust this value as needed
        maxHeight: '50vh', // Adjust this value as needed
      }}
    >
      {uploading && (
        <ListItem>
          <LinearProgress variant="determinate" value={uploadPercentage} sx={{ width: '100%' }} />
        </ListItem>
      )}
      {labels.map((label, index) => (
        <ListItem
          key={index}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' }, fontSize: '2vw' }}
        >
          <label htmlFor={`fileInput${index}`} style={{ width: '100%' }}>
            <input
              ref={fileInputRef}
              id={`fileInput${index}`}
              type="file"
              accept={label.toLowerCase() === 'profile picture' ? 'image/*' : 'video/*'}
              style={{ display: 'none' }}
              onChange={(event) => handleFileChange(event, label.toLowerCase())}
            />
            <ListItemText sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }} primary={`Upload ${label}`} />
          </label>
        </ListItem>
      ))}
    </List>
  );
};

export default FileUploadOptions;
