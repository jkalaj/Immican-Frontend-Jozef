import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Select, MenuItem, List, ListItem, ListItemText, IconButton, LinearProgress, Alert } from '@mui/material';
import { CloudUploadOutlined as CloudUploadOutlinedIcon, DeleteOutline, PictureAsPdf  } from '@mui/icons-material';
import {fileUpload, getFileData, deleteData} from "../../../../api/FetchData";
import PdfViewer from './PdfViewer';

const UploadDocument = () => {
  const [documentType, setDocumentType] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
  const [alertOpen, setAlertOpen] = useState(false);

  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

  const documentTypeOptions = ['Article of Incorporation', 'Good Standing Screenshot (Optional)'];

  const additionalOptions = {
    'Educational Certificate': ['High School Diploma', "Bachelor's Degree", "Master's Degree"],
  };

  const fetchData = async () => {
    try {
      let userToken = localStorage.getItem("access_token");
      const result = await getFileData('user/getUploadFiles', '', userToken);

      if (result.status === 200) {
        const documents = result.data.data.map(document => ({
          name: document.documentName,
          documentType: document.documentType,
          selectedOption: document.documentSubType || ' ', // Use empty string as the default value
          type: document.contentType,
          imageUrl: document.fileUrl,
          id: document.id,
        }));
        setUploadedDocuments(documents);
      }
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
    }
  };

  function capitalizeEachWord(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }



  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      await fetchData();
    };

    fetchDataAndUpdateState();
  }, [uploading]);



  const saveFile = async (options) => {
    try {
      await fileUpload('user/uploadDocuments', options);
      console.log('File saved successfully');
      fetchData();
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
    setSelectedOption('');
    setAlertOpen(false); // Close the alert when a document type is selected
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFileUpload = async (files) => {
    if (!documentType) {
      setAlertOpen(true);
      return;
    }

    const validFiles = files.filter((file) => file.size <= maxSizeInBytes);

    if (validFiles.length === 0) {
      alert(`File size exceeds the limit (5 MB). Please upload smaller files.`);
      return;
    }

    // Check if any document of the same type and option is already uploaded
    const isSameTypeUploaded = uploadedDocuments.some(
      (doc) => doc.documentType === documentType && doc.selectedOption === selectedOption
    );

    if (isSameTypeUploaded) {
      alert(`You have already uploaded a document of type ${documentType} with the selected option.`);
      return;
    }

    setUploading(true);

    for (const file of validFiles) {
      await uploadFile(file);
      await saveFile({
        document_name: file.name,
        document_type: documentType,
        document_sub_type: selectedOption,
        document_data: file,
      });
    }
    setUploading(false);
    setUploadPercentage(0);
  };


  const uploadFile = (file) => {
    return new Promise((resolve) => {
      const totalSize = file.size;
      let uploadedSize = 0;

      const interval = setInterval(() => {
        if (uploadedSize >= totalSize) {
          clearInterval(interval);
          resolve();
        } else {
          // Simulate progress update
          uploadedSize += Math.min(1024 * 1024, totalSize - uploadedSize);
          const percentage = (uploadedSize / totalSize) * 100;
          setUploadPercentage(percentage);
        }
      }, 1000);
    });
  };

  const handleDeleteDocument = async (id) => {
    try {
      let userToken = localStorage.getItem("access_token");
      const options = { id: id };

      // Make a request to delete the file
      await deleteData('user/deleteFile', options, userToken);

      // Fetch the updated data after successful deletion
      await fetchData();

      // Update the state after fetching the data
      setUploadedDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };



  const handleDrop = (event) => {
    event.preventDefault();

    if (event.dataTransfer.items) {
      // Handle items
      const files = Array.from(event.dataTransfer.items).map((item) => item.getAsFile());
      handleFileUpload(files);
    } else {
      // Handle files
      const files = Array.from(event.dataTransfer.files);
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropAreaClick = () => {
    fileInputRef.current.click();
  };

  const handlePdfIconClick = (pdfUrl) => {
    console.log("pdfUrl", pdfUrl)
    setSelectedPdfUrl(pdfUrl);
    setPdfViewerOpen(true);
  };

  return (
    <Card sx={{ width: '95%', margin: 'auto', textAlign: 'center', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5', marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <CardContent style={{ borderRight: '1px solid #ccc', paddingRight: '20px', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Upload your Document
        </Typography>
        {alertOpen && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            Please select a document type.
          </Alert>
        )}
        <Select
          value={documentType}
          onChange={handleDocumentTypeChange}
          fullWidth
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="" disabled>
            Select Document Type
          </MenuItem>
          {documentTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {documentType && additionalOptions[documentType] && (
          <Select
            value={selectedOption}
            onChange={handleOptionChange}
            fullWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="" disabled>
              Select Option
            </MenuItem>
            {additionalOptions[documentType].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
        <div
          ref={dropAreaRef}
          style={{
            border: '2px dashed #ccc',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100px', // Adjust the height as needed
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleDropAreaClick}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 48, marginBottom: 1 }} />
          <Typography variant="body1" sx={{ color: '#555', marginBottom: 1 }}>
            Drag and drop files here or click to select files.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: 1 }}
          >
            Choose File
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(event) => handleFileUpload(Array.from(event.target.files))}
        />
      </CardContent>
      <CardContent style={{ overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Uploaded Documents
        </Typography>
        <List>
        {uploadedDocuments
          .filter((uploadedDoc) => uploadedDoc.documentType? uploadedDoc.documentType !== 'your_story' && uploadedDoc.documentType !== 'profile_picture'&& uploadedDoc.documentType !== 'business_your_story' && uploadedDoc.documentType !== 'business_profile_picture' : null)
          .map((uploadedDoc, index) => (
            <ListItem
              key={index}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #ccc',
                padding: '10px',
              }}
            >
              <ListItemText
                primary={`${capitalizeEachWord(uploadedDoc.documentType)} - ${capitalizeEachWord(uploadedDoc.selectedOption)}`}
                secondary={uploadedDoc.name}
              />
              {uploadedDoc.type.startsWith('image/') ? (
                <img
                  src={uploadedDoc.imageUrl}
                  alt={uploadedDoc.name}
                  style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }}
                />
              ) : uploadedDoc.type === 'application/pdf' ? (
                // Show PDF icon
                <PictureAsPdf
                    sx={{ fontSize: 40, marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                    onClick={() => handlePdfIconClick(uploadedDoc.imageUrl)}
                  />
                ) : null}
              <IconButton onClick={() => handleDeleteDocument(uploadedDoc.id)}>
                <DeleteOutline />
              </IconButton>
            </ListItem>
          ))}
      </List>
      </CardContent>
      {/* Render the PdfViewer component when pdfViewerOpen state is true */}
      {pdfViewerOpen && (
        <PdfViewer
          open={pdfViewerOpen}
          handleClose={() => setPdfViewerOpen(false)}
          pdfUrl={selectedPdfUrl}
        />
      )}

      {uploading && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            zIndex: '2001',
            backgroundColor: '#fff',
            padding: '10px',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Uploading...
          </Typography>
          <LinearProgress variant="determinate" value={uploadPercentage} sx={{ marginTop: 1 }} />
        </div>
      )}

      {/* Media query for smaller screens */}
      <style>
        {`
          @media (max-width: 600px) {
            .MuiCard-root {
              grid-template-columns: 1fr; /* Change to a single column layout */
            }
          }
        `}
      </style>

    </Card>
  );
};

export default UploadDocument;
