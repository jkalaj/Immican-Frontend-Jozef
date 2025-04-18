// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import {getSingleData} from "../../../../../api/FetchData";
import UserProfileCard from '../myStory/UserProfileCard';


const ViewProfile = (props) => {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');


  const getOrganizationData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('user/getOrganizationDetails', '', userToken);
  }


  useEffect(() => {
    getOrganizationData().then((data)=>{
      console.log('getOrganizationData', data)
      setEmail(data.email)
      setPhone(data.phone)
      setCompanyName(data.companyName)
      setCountry(data.country)
      setAbout(data.about)
      setAddress(data.address)
    })
  }, []);

  return (
      <Grid container spacing={4} style={{marginTop: '10px'}}>
        {props.stroy === 'Off'?
          null:
          <Grid item md={4} xs={12}>
            <UserProfileCard />
          </Grid>
        }

        <Grid item md={props.stroy === 'Off'?12:8} xs={12}>
          <Card>
            <CardContent>
              <Typography className="paddingLevel" component="h5" variant="h5">About</Typography>
              <Typography style={{marginBottom: '20px'}} className="paddingLevel" component="p" variant="p">{about}</Typography>
              <Typography className="paddingLevel" component="h5" variant="h5">Profile Details</Typography>
              <Grid container spacing={4}>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Company</Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{companyName}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Country </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{country}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Address </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{address}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Phone </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{phone}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Email </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  )
}

export default ViewProfile
