// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React, { useContext } from "react";
import UserProfileCard from "../myStory/UserProfileCard";
import {StateContext} from "../../../../@core/context/stateContext";


const ViewProfile = (props) => {
  const { values } = useContext(StateContext)

  return (
      <Grid container spacing={4} style={{marginTop: '10px'}}>
        {props.stroy === 'Off'?
          null:
          <Grid item md={4} xs={12}>
            <UserProfileCard/>
          </Grid>
        }

        <Grid item md={props.stroy === 'Off'?12:8} xs={12}>
          <Card>
            <CardContent>
              <Typography className="paddingLevel" component="h5" variant="h5">About</Typography>
              <Typography style={{marginBottom: '20px'}} className="paddingLevel" component="p" variant="p">{values.about}</Typography>
              <Typography className="paddingLevel" component="h5" variant="h5">Profile Details</Typography>
              <Grid container spacing={4}>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Name</Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{values.firstName} {values.lastName}</Typography>
                </Grid>
                {values.userType === 'Professional'?
                  <>
                    <Grid item md={3} xs={12}>
                      <Typography className="paddingLevel levelDesign" component="p" variant="p">Company</Typography>
                    </Grid>
                    <Grid item md={9} xs={12}>
                      <Typography className="paddingLevel" component="p" variant="p">{values.companyLegalName}</Typography>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Typography className="paddingLevel levelDesign" component="p" variant="p">Job </Typography>
                    </Grid>
                    <Grid item md={9} xs={12}>
                      <Typography className="paddingLevel" component="p" variant="p">{values.jobPosition}</Typography>
                    </Grid>
                  </>:null
                }
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Country </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{values.country}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Address </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{values.address}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Phone </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{values.phone}</Typography>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Typography className="paddingLevel levelDesign" component="p" variant="p">Email </Typography>
                </Grid>
                <Grid item md={9} xs={12}>
                  <Typography className="paddingLevel" component="p" variant="p">{values.email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  )
}

export default ViewProfile
