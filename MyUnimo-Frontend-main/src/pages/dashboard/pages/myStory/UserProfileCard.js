import {getFileDetails} from "../../../../@core/utils/CommonFunctions";

"Use-Client";
import React, {useEffect, useState} from 'react';
import {Avatar, Card, CardContent, IconButton, List, ListItem, ListItemText, Typography} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  PhotoCamera as PhotoCameraIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import FileUploadOptions from './FileUploadOptions';
import ViewProfileModal from './ViewProfileModal';

import {getFileData, getSingleData} from "../../../../api/FetchData";

const UserProfileCard = (props) => {
  const [showFileUploadOptions, setShowFileUploadOptions] = useState(false);
  const [userType, setUserType] = useState('');
  const [avatarSrc, setAvatarSrc] = useState(props.avatarSrc);
  const [storySrc, setStorySrc] = useState(props.storyPath);
  const [hasStory, setHasStory] = useState(props.hasStory);
  const [uploadOptionsLabels] = useState(['profile picture', 'your story']);
  const [viewType, setViewType] = useState(null);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [twitterProfile, setTwitterProfile] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');
  const [instagramProfile, setInstagramProfile] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');

  const handleUploadClick = (e) => {
    e.stopPropagation();
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

  const handleViewOptionsClick = (event) => {
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

  const getUserData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('user/getUserDetails', '', userToken);
  }

  const profilePicture = async () =>{
    return await getFileDetails()
  }

  useEffect(() => {
    profilePicture().then((data)=>{
      // console.log('data', data)
      if(data !==  undefined){
        data.forEach(file => {
          if (file.documentType === 'profile_picture') {
            setAvatarSrc(file.imageUrl);
          } else if (file.documentType === 'your_story') {
            setStorySrc(file.imageUrl);
            setHasStory(true);
          }
        });
      }
    })
  }, [props]);


  useEffect(() => {
    getUserData().then((data)=>{
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setUserType(data.userType)
      setTwitterProfile(data.twitterProfile)
      setFacebookProfile(data.facebookProfile)
      setInstagramProfile(data.instagramProfile)
      setLinkedinProfile(data.linkedinProfile)
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
          <div onClick={handleViewOptionsClick} style={{position: 'relative', margin: 'auto', display: 'inline-block',
              borderRadius: '50%', width: '110px', height: '110px', backgroundColor: 'white', border: '3px solid #0d47a1',
              boxSizing: 'border-box', cursor: 'pointer'}}>
            <Avatar alt="profile picture" src={avatarSrc} sx={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {!hasStory && (
          <Avatar alt="profile picture" src={avatarSrc}
            sx={{width: '110px', height: '110px', margin: 'auto', cursor: 'pointer',}}
            onClick={handleViewOptionsClick}/>
        )}
        <IconButton onClick={handleUploadClick}
          sx={{position: 'absolute', bottom: '5%', right: '0%', backgroundColor: 'white', cursor: 'pointer'}}>
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
        <List id="viewOptions" style={{position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#fff', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)', zIndex: 100,}}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }}>
          <ListItem onClick={handleViewProfileClick} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0'}}}>
            <ListItemText sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0' } }} primary="View Profile" />
          </ListItem>
          <ListItem onClick={handleViewStoryClick} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e0e0e0'}}}>
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
      {`${firstName} ${lastName}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
      {userType}
      </Typography>
      {/* Social media icons in a single line */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton href={instagramProfile} target="_blank">
          <InstagramIcon />
        </IconButton>
        <IconButton href={twitterProfile} target="_blank">
          <TwitterIcon />
        </IconButton>
        <IconButton href={facebookProfile} target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton href={linkedinProfile} target="_blank">
          <LinkedInIcon />
        </IconButton>
      </div>
    </CardContent>
  </Card>
  );
};

export default UserProfileCard;
