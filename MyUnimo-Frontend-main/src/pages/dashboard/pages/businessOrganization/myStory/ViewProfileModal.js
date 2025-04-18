import React from 'react';
import { Modal, Fade, Button, Typography, Box } from '@mui/material';
import VideoPlayerCard from './VideoPlayerCard';

const ViewProfileModal = ({ isOpen, onClose, profilePictureSrc, storySrc, viewType }) => {
  const isProfileView = viewType === 'profile';
  const isStoryView = viewType === 'story';

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop color
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: '20px',
              textAlign: 'center',
              maxWidth: '80%',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '20px' }}>
              View {isProfileView ? 'Profile' : 'Story'}
            </Typography>
            {isProfileView && (
              <img
                src={profilePictureSrc}
                alt="profile picture"
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', marginBottom: '20px' }}
              />
            )}
            {isStoryView && (
              <VideoPlayerCard videoUrl={storySrc}/>
            )}
            <Button variant="contained" onClick={onClose} sx={{ marginTop: '20px' }}>
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ViewProfileModal;
