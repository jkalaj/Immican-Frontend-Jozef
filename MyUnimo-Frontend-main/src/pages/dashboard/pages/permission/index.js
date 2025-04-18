// ** MUI Imports
import Grid from '@mui/material/Grid'
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {getSingleData, postData} from "../../../../api/FetchData";
import DescriptionAlerts from "../../../../@core/utils/alert";

const Permission = () => {
  const [state, setState] = React.useState({
    accountChange: false,
    newService: false,
    promoOffer: false,
    securityAlert: true,
  });
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
    });
  };

  const { accountChange, newService, promoOffer, securityAlert } = state;

  const submitPermission = async (e) => {
    e.preventDefault()

    const options = {
      accountChange: accountChange, newService: newService, promoOffer: promoOffer}

    const data = await postData('user/updateProfessionalPermission', options);
    if(data.status === 'success'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('success')
    }
    else if(data.status === 'failed'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')
    }
  }

  const getPermissionData = async () =>{
    let userToken = localStorage.getItem("access_token")

    return await getSingleData('user/getProfessionalDetails', '', userToken);
  }

  useEffect(() => {
    getPermissionData().then((data)=>{
      setState({
        accountChange: data.accountChange,
        newService: data.newService,
        promoOffer: data.promoOffer,
        securityAlert: data.securityAlert,
      });
    })
  }, []);

  return (
    <Grid container spacing={4}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
       <Grid item md={3} xs={12}>
         <Typography className="paddingLevel" component="p" variant="p">Email Notifications</Typography>
       </Grid>
      <Grid item md={7} xs={12}>
        <FormGroup>
          <FormControlLabel checked control={<Checkbox checked={accountChange} onChange={(e)=>handleChange(e)}
                                                       name="accountChange" />} label="Changes made to your account" />
          <FormControlLabel control={<Checkbox checked={newService} onChange={(e)=>handleChange(e)}
                                               name="newService" />} label="Information on new products and services" />
          <FormControlLabel control={<Checkbox checked={promoOffer} onChange={(e)=>handleChange(e)}
                                               name="promoOffer"/>} label="Marketing and promo offers" />
          <FormControlLabel disabled control={<Checkbox checked={securityAlert} />} label="Security alerts" />
        </FormGroup>
      </Grid>
      <Grid item md={12} style={{textAlign: 'center'}}>
        <Box sx={{gap: 5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'}}>
          <Button type='submit' variant='contained' size='large' onClick={(e)=>submitPermission(e)}>
            Save Changes
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Permission
