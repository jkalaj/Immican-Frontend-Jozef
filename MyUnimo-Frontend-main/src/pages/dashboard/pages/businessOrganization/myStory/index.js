// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import React, {useState, useEffect} from "react";
import { styled } from '@mui/material/styles'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTab from '@mui/material/Tab'
import Box from '@mui/material/Box'
// import ViewProfile from "../viewProfile";
// import EditProfile from "../editProfile";
// import Permission from "../permission";
import UserProfileCard from './UserProfileCard';
import VideoPlayerCard from './VideoPlayerCard';
import InstructionWithFileUpload from './InstructionWithFileUpload';

import {getSingleData, getFileData} from "../../../../../api/FetchData";

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  // [theme.breakpoints.down('md')]: {
  //   display: 'none'
  // }
}))

const MyStory = () => {
  const [value, setValue] = useState('viewYourStory')
  const [storyPath, setStoryPath] = useState('');
  const [avatarSrc, setAvatarSrc] = useState("/path-to-your-image.jpg");
  const [hasStory, setHasStory] = useState(false);

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
  
        documents.forEach(file => {
          if (file.documentType === 'business_profile_picture') {
            setAvatarSrc(file.imageUrl);
          } else if (file.documentType === 'business_your_story') {
            setStoryPath(file.imageUrl);
            setHasStory(true);
          }
        });
  
        setUploadedDocuments(documents);
      } 
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
    }
  };
  

  const reloadData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const instructions = 'Follow the instructions below:';
  const fileUploadLabels = ['your story'];


  return (
    <Grid container spacing={4}>
      <Grid item md={4} xs={12}>
      <UserProfileCard
          avatarSrc={avatarSrc}
          storyPath={storyPath}
          hasStory={hasStory}
          reloadData={reloadData}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <Card>
          <CardContent>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label='account-settings tabs'
                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
              >
                <Tab
                  value='viewYourStory'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TabName>View your story</TabName>
                    </Box>
                  }
                />
                <Tab
                  value='uploadYourStory'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TabName>Upload your story</TabName>
                    </Box>
                  }
                />
              </TabList>

              <TabPanel sx={{ p: 0 }} value='viewYourStory'>
                 <VideoPlayerCard videoUrl={storyPath} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='uploadYourStory'>
                 <InstructionWithFileUpload
                  instructions={instructions}
                  fileUploadLabels={fileUploadLabels}
                  reloadData={reloadData}
                />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MyStory
