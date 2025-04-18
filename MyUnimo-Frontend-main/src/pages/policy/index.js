import React, {useEffect, useState} from 'react';
import BlankLayout from "../../@core/layouts/BlankLayout";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Box from "@mui/material/Box";
import TabPanel from "@mui/lab/TabPanel";
import {styled} from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import {getLookUpData} from "../../api/CommonApi";
import ShowPolicy from "./showPolicy";
import Copyright from "../../@core/utils/footer";


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
  fontSize: '0.550rem',
  marginLeft: theme.spacing(2.4)
}))

const Policy = () => {
  const [value, setValue] = useState('')
  const [policyList, setPolicyList] = useState([])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    getLookUpData('9', '1').then((data)=> {
      setPolicyList(data.data)
      if (data.data.length !== 0){
        data.data.map((item, key)=>{
          if(key === 0){
            setValue(item.id)
          }
        })
      }
    })
  }, []);
  return (
    <Grid container spacing={4}>
      <Grid item md={2} xs={0}/>
      <Grid item md={8} xs={12}>
        <Card>
          <CardContent>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label='account-settings tabs'
                       sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }} style={{overflow: 'auto'}}>
                {policyList.map((item)=>
                  <Tab value={item.id}  style={{overflow: 'auto'}} label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TabName style={{fontSize: '10px'}}>{item.levelData}</TabName>
                    </Box>
                  }
                  />
                )}
              </TabList>
              {policyList.map((item)=>
                <TabPanel sx={{ p: 0 }} value={item.id}>
                  <ShowPolicy lookUpId={value} />
                </TabPanel>
              )}
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={2} xs={0}/>
      <Grid item md={12} xs={12}>
        {/* --- Footer --- */}
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Grid>
    </Grid>
  );
};
Policy.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default Policy;
