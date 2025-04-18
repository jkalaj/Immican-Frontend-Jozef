// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import React, {useContext, useEffect, useState} from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { postData } from "../../../../api/FetchData";
import Typography from "@mui/material/Typography";
import UserProfileCard from "../myStory/UserProfileCard";
import {StateContext} from "../../../../@core/context/stateContext";


const ViewAllow = () => {
  const [allowChecked, setAllowChecked] = useState(true)
  const { values } = useContext(StateContext)

  const submitAllow = async (e) => {
    e.preventDefault()
    const options = {profileAllow: e.target.checked}
    const data = await postData('user/allowView', options);
  }

  useEffect(() => {
    setAllowChecked(values.profileAllow)
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item md={4} xs={12}>
        <UserProfileCard />
      </Grid>
      <Grid item md={8} xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={4} style={{marginBottom: '10px'}}>
              <Grid item md={3} xs={12}>
                <Typography className="paddingLevel levelDesign" component="p" variant="p">Name</Typography>
              </Grid>
              <Grid item md={9} xs={12}>
                <Typography className="paddingLevel" component="p" variant="p">{values.firstName} {values.lastName}</Typography>
              </Grid>
            </Grid>
            <FormGroup>
              <FormControlLabel control={<Switch checked={allowChecked}
                                onChange={(e)=> {
                                setAllowChecked(e.target.checked); submitAllow(e)}}/>}
                                label="Profile View Allow" />
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewAllow
