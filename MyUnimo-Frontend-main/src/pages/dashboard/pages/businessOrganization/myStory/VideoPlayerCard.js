import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

const VideoPlayerCard = ({ videoUrl }) => {
  return (
    <Card sx={{ textAlign: 'center', maxWidth: 400 }}>
      <CardContent>
        <video
          controls
          width="100%"
          height="420px"
          src={videoUrl}
          style={{ borderRadius: '8px', outline: 'none' }}
        >
          Your browser does not support the video tag.
        </video>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          Tap to play
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoPlayerCard;
