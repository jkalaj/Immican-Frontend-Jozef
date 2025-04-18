import React, {useState} from 'react';
import Grid from "@mui/material/Grid";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import ViewMyUnimo from "./ViewMyUnimo";
import AddMyUnimo from "./AddMyUnimo";
import {styled} from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CurrentClients from './CurrentClients';

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

const MyUnimo = () => {
  const [value, setValue] = useState('AddMyUnimo')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
            <Tab value='AddMyUnimo' label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Invite / Match Clients</TabName>
                </Box>
              }
            />
            <Tab value='CurrentClients' label={
                <Box sx={{display: 'flex', alignItems: 'center' }}>
                  <TabName>Current Clients</TabName>
                </Box>
              }
            />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='AddMyUnimo'>
            <Grid item md={12} xs={12}>
              <AddMyUnimo />
            </Grid>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='CurrentClients'>
            <Grid item md={12} xs={12}>
              <CurrentClients />
            </Grid>
          </TabPanel>

        </TabContext>
      </Grid>
    </Grid>
  );
};

export default MyUnimo;
