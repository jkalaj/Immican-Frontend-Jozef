"Use-Client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Avatar, Button, List, ListItem, ListItemText  } from '@mui/material';
import {
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import FileUploadOptions from './FileUploadOptions';
import ViewProfileModal from './ViewProfileModal';

import {getSingleData, getFileData} from "../../../../../api/FetchData";

const UserProfileCard = (props) => {
  const [showFileUploadOptions, setShowFileUploadOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [avatarSrc, setAvatarSrc] = useState(props.avatarSrc);
  const [storySrc, setStorySrc] = useState(props.storyPath);
  const [hasStory, setHasStory] = useState(props.hasStory);
  const [uploadOptionsLabels, setUploadOptionsLabels] = useState(['profile picture', 'your story']);
  const [viewType, setViewType] = useState(null);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [jobPosition, setJobPosition] = useState('');

  const handleUploadClick = () => {
    event.stopPropagation();
    setShowFileUploadOptions(true);
  };

  const handleFileSelect = (file, uploadType) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target.result;

      if (uploadType === 'profile_picture') {
        setAvatarSrc(dataUrl);
      } else if (uploadType === 'your_story') {
        setStorySrc(dataUrl)
        setHasStory(true);
      }

      setShowFileUploadOptions(false);

      // Handle file upload logic here
      // console.log('Selected File:', file);
      // console.log('Upload Type:', uploadType);
    };

    reader.readAsDataURL(file);
  };

  const handleCancelUpload = () => {
    setShowFileUploadOptions(false);
  };

  const handleViewOptionsClick = () => {
    event.stopPropagation();
    setShowViewOptions(!showViewOptions);
  };

  const handleViewProfileClick = () => {
    setViewModalOpen(true);
    setShowViewOptions(false);
    setViewType('profile');
  };

  const handleViewStoryClick = () => {
    setViewModalOpen(true);
    setShowViewOptions(false);
    setViewType('story');
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const getOrganizationData = async () =>{
    let userToken = localStorage.getItem("access_token")

    return await getSingleData('user/getOrganizationDetails', '', userToken);
  }

  const fetchData = async () => {
    try {
      let userToken = localStorage.getItem("access_token");
      const result = await getFileData('user/getUploadFiles', '', userToken);
  
      if (result.status === 200) {
        const documents = result.data.data.map(document => ({
          name: document.documentName,
          documentType: document.documentType,
          selectedOption: document.documentSubType || ' ',
          type: document.contentType,
          imageUrl: document.fileUrl,
          id: document.id,
        }));
  
        documents.forEach(file => {
          if (file.documentType === 'business_profile_picture') {
            setAvatarSrc(file.imageUrl);
          } else if (file.documentType === 'business_your_story') {
            setStorySrc(file.imageUrl);
            setHasStory(true);
          }
        });
  
        setUploadedDocuments(documents);
      } else {
        console.error('Error fetching uploaded documents. Status:', result.status);
      }
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  
  useEffect(() => {
    getOrganizationData().then((data)=>{
      setCompanyName(data.companyName)
      setJobPosition(data.jobPosition)
    })

    const handleBodyClick = (event) => {
      const isInsideViewOptions = event.target.closest('#viewOptions');
      if (!isInsideViewOptions) {
        setViewModalOpen(false);
        setShowViewOptions(false);
      }
    };
  
    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
    
  }, []);

  // Log the data whenever avatarSrc, storySrc, or hasStory changes
  useEffect(() => {
    // Check if avatarSrc exists in props and set it if available
    if (props.avatarSrc) {
      setAvatarSrc(props.avatarSrc);
    }

    // Check if storyPath exists in props and set it if available
    if (props.storyPath) {
      setStorySrc(props.storyPath);
    }

    // Check if hasStory exists in props and set it if available
    if (props.hasStory !== undefined) {
      setHasStory(props.hasStory);
    }

  }, [props.avatarSrc, props.storyPath, props.hasStory]);
  

  return (
    <Card sx={{ textAlign: 'center' }}>
    <CardContent>
    <div style={{ position: 'relative', marginBottom: 2 }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {hasStory && (
          <div
            onClick={handleViewOptionsClick}
            style={{
              position: 'relative',
              margin: 'auto',
              display: 'inline-block',
              borderRadius: '50%',
              width: '110px',
              height: '110px',
              backgroundColor: 'white',
              border: '3px solid #0d47a1',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <Avatar alt="profile picture" src={avatarSrc} sx={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {!hasStory && (
          <Avatar
            alt="profile picture"
            src={avatarSrc}
            sx={{
              width: '110px',
              height: '110px',
              margin: 'auto',
              cursor: 'pointer',
            }}
            onClick={handleViewOptionsClick}
          />
        )}
        <IconButton
          onClick={handleUploadClick}
          sx={{
            position: 'absolute',
            bottom: '5%',
            right: '0%', 
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <PhotoCameraIcon />
        </IconButton>
      </div>

      {showFileUploadOptions && (
        <FileUploadOptions
           onSelectFile={handleFileSelect}
          onCancel={handleCancelUpload}
          labels={uploadOptionsLabels}
          maxImageSize={5242880} // Maximum image size in bytes (5MB)
          maxVideoSize={157286400} // Maximum video size in bytes (150MB)
          reloadData={props.reloadData}
        />
      )}
      {showViewOptions && (
        <List
          id="viewOptions"  
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)',
            zIndex: 100,
          }}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <ListItem
            onClick={handleViewProfileClick}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <ListItemText sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }} primary="View Profile" />
          </ListItem>
          <ListItem
            onClick={handleViewStoryClick}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <ListItemText sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }} primary="View Story" />
          </ListItem>
        </List>
      )}
      <ViewProfileModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        profilePictureSrc={avatarSrc}
        storySrc={storySrc}
        viewType={viewType}
      />
      </div>
      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
      {`${companyName?companyName:'Company Name'}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
      {jobPosition?jobPosition:''}
      </Typography>
      {/* Social media icons in a single line */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton href="https://www.instagram.com/" target="_blank">
          <InstagramIcon />
        </IconButton>
        <IconButton href="https://twitter.com/" target="_blank">
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://www.facebook.com/" target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://www.linkedin.com/" target="_blank">
          <LinkedInIcon />
        </IconButton>
      </div>
    </CardContent>
  </Card>
  );
};

export default UserProfileCard;
