import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from "../../@core/utils/footer";
import ImmigrantSignUp from "./ImmigrantSignUp";
import ProfessionalSignUp from "./ProfessionalSignUp";
import {useEffect, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getLookUpData} from "../../api/CommonApi";
import Link from "@mui/material/Link";

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const RegisterPage = () => {
  // ** States
  const [registrationTypeList, setRegistrationTypeList] = useState([])
  const [regiType, setRegiType] = useState('')

  // ** Hook
  const theme = createTheme();


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // console.log('sa', searchParams.get('email'));
    const typeCheck = searchParams.has('type')
    console.log('type', typeCheck)
    if (typeCheck === true){
      const type = searchParams.get('type')
      setRegiType(type)
    }
    getLookUpData('4', '1').then((data)=> setRegistrationTypeList(data.data))
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box sx={{marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',  px: 2, py: 3}}>
          <Typography style={{fontSize: '36px', fontWeight: '700', color: '#012970', fontFamily: 'Nunito, sans-serif'}}
                      component="h3" variant="h3">
          <img style={{maxHeight: '34px', marginRight: '6px'}} src="/images/logo.png" alt="Logo Image" />ImmiCan</Typography>
        </Box>
        <Box sx={{marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: 3, borderRadius: 2, px: 4, py: 6}}>

          {/* --- Registration Type --- */}
          <Typography component="h1" variant="h5">Create an Account</Typography>
          <Typography component="p" variant="p">Enter your personal details to create account</Typography>
          <Box component="form" noValidate sx={{ mt: 3 }} style={{width: '100%'}}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Registration Type *</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select"
                        value={regiType} label="Registration Type * "
                        onChange={(event) => setRegiType(event.target.value)}>
                  {registrationTypeList.map((item, key) =>
                      <MenuItem key={key} value={item.levelData}>{item.levelData}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Box>

          {regiType === 'Immigrant'?
              // Immigrant Sign Up
              <ImmigrantSignUp regiType={regiType} />
              :
              regiType === 'Professional'?
              // Professional Sign Up
              <ProfessionalSignUp regiType={regiType} /> :null

          }

          {/* --- Sign In Option ---*/}
          <Grid container justifyContent="flex-end" style={{marginTop:'5px'}}>
            <Grid item>
              <Link href='/login' style={{cursor: 'pointer'}} variant="body2">Already have
                an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>

        {/* ---- Footer ----- */}
        <Copyright sx={{mt: 5}}/>

      </Container>
    </ThemeProvider>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
