// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {getSingleData, postData} from "../../../../../api/FetchData";
import Typography from "@mui/material/Typography";
// import DescriptionAlerts from "../../../../@core/utils/alert";
import UserProfileCard from '../myStory/UserProfileCard';


const ViewAllow = () => {
  const [allowChecked, setAllowChecked] = useState(true)
  const [companyName, setCompanyName] = useState('')

  const submitAllow = async (e) => {
    e.preventDefault()

    const options = {profileAllow: e.target.checked}
    const data = await postData('user/allowOrgView', options);

    if(data.status === 'success'){
      // setOpenAlert(true)
      // setErrorMessage(data.message)
      // setAlertType('success')
    }
    else if(data.status === 'failed'){
      // setOpenAlert(true)
      // setErrorMessage(data.message)
      // setAlertType('error')
    }
  }

  const getOrgData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('user/getOrganizationDetails', '', userToken);
  }

  useEffect(() => {
    getOrgData().then((data)=>{
      setCompanyName(data.companyName)
      setAllowChecked(data.profileAllow)
    })
  }, []);

  return (
    <Grid container spacing={4}>
      {/*{openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}*/}
      <Grid item md={4} xs={12}>
        <UserProfileCard />
      </Grid>
      <Grid item md={8} xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={4} style={{marginBottom: '10px'}}>
              <Grid item md={3} xs={12}>
                <Typography className="paddingLevel levelDesign" component="p" variant="p">Company Name</Typography>
              </Grid>
              <Grid item md={9} xs={12}>
                <Typography className="paddingLevel" component="p" variant="p">{companyName}</Typography>
              </Grid>
            </Grid>
            <FormGroup>
              <FormControlLabel control={<Switch checked={allowChecked} onChange={(e)=> {
                                  setAllowChecked(e.target.checked); submitAllow(e)}}/>} label="Profile View Allow" />
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewAllow
