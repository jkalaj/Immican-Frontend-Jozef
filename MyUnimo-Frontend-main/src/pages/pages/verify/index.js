// ** React Imports

import React, {useEffect, useState, useRef} from 'react';
import Link from '@mui/material/Link';

// Mui Imports

import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Files Imports

import {getData} from '../../../api/FetchData';
import Copyright from "../../../@core/utils/footer";
import {useRouter} from "next/router";
import DescriptionAlerts from '../../../@core/utils/alert';

// ** Layout Import

import BlankLayout from 'src/@core/layouts/BlankLayout';
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";


const Verify = () => {
  // ** State

  const [status, setStatus] = useState('failed')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [alertType, setAlertType] = useState('')
  const [emailHas, setEmailHas] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [displayAll, setDisplayAll] = useState(false)
  const dataFetchedRef = useRef(false);
  const [loader, setLoader] = useState(false)
  const router = useRouter();

  const defaultTheme = createTheme();

  const verifyEmailAddress = async (email, token) => {
      const options = {email: email, token: token}

      return await getData('mail/verify', options);
  }

  const handleEmailVerify = async () => {
      if(emailHas){

          setLoader(true)
          const options = {email: email}
          const data = await getData('mail/confirmationSend', options);
          // console.log('sara', data)
          setAlertType(data.status === 'failed'? 'error' : data.status)
          setErrorMessage(data.message)
          setOpenAlert(true)
          setLoader(false)
      }
  }

  const loginRoute = () =>{
      router.push('/login');
  }

  useEffect(() => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      let ignore = false;
      // console.log('displayAll', displayAll)
      if(!ignore){
          const searchParams = new URLSearchParams(window.location.search);
          // console.log('sa', searchParams.get('email'));
          const emailHas = searchParams.has('email')
          const tokenHas = searchParams.has('token')
          setEmailHas(emailHas)
          if(emailHas && tokenHas){
              setEmail(searchParams.get('email'))
              verifyEmailAddress(searchParams.get('email'), searchParams.get('token')).then((data)=>
              {setMessage(data.message);setStatus(data.status)})
              setDisplayAll(true)
          } else {
              setDisplayAll(false)
          }
      }

      return () => { ignore = true }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
            {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box sx={{marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',  px: 2, py: 3}}>
                    <Link href='/login' style={{cursor: 'pointer', textDecoration: 'none'}} variant="body2">
                        <Typography style={{fontSize: '36px', fontWeight: '700', color: '#012970', fontFamily: 'Nunito, sans-serif'}}
                                component="h3" variant="h3">
                        <img style={{maxHeight: '34px', marginRight: '6px'}} src="/images/logo.png" alt="Logo Image" />ImmiCan</Typography>
                    </Link>
                </Box>
                {displayAll?
                <Box sx={{marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    boxShadow: 3, borderRadius: 2, px: 4, py: 6,}} style={{background: status === 'success'?'#00800099':'#971a1a8a'}}>
                    {/* --- Message --- */}
                    {status === 'success'?
                        <Typography component="p" variant="p">{message}.
                            <span onClick={() => loginRoute()}
                                  style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>
                                 click here</span> for login.</Typography> :
                        status === 'failed' ?
                          !loader?
                            <Typography component="p" variant="p">{message}.
                              <span onClick={()=>handleEmailVerify()}
                                    style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>
                                 click here </span> to send again verification link</Typography>
                            :
                            <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                              <CircularProgress color="secondary" />
                            </Stack>
                            :null
                    }
                </Box>:null}
                {/* --- Footer --- */}
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
  )
}
Verify.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Verify
