// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {getData, postData} from '../../api/FetchData';
import DescriptionAlerts from '../../@core/utils/alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import Copyright from "../../@core/utils/footer";

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

const defaultTheme = createTheme();

const LoginPage = () => {
  // ** State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openEmailAlert, setOpenEmailAlert] = useState(false)
  const [openPassAlert, setOpenPassAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false)
  const [sendLinkAgain, setSendLinkAgain] = useState(false)
  const [loader, setLoader] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter();

  // Submit Sign In Button
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let email = data.get('email')
    let password = data.get('password')
    let validationCheck = handleEmptyFieldCheck(email, password)
    if(validationCheck === false){
      setOpenEmailAlert(false)
      setOpenPassAlert(false)
      signedIn().then((data)=>{
        if(data.status === 'success'){
          localStorage.setItem('access_token', data.access_token);
          data.user_type === 'Professional'?
             router.push('/dashboard')
            :
            data.user_type === 'Immigrant'?
              router.push('/immigrant/dashboard')
              :
              null
        }
        else if(data.status === 'failed'){
          setSendLinkAgain(data.sendLink)
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')
        } else if(data.status === 'error'){
          setOpenAlert(true)
          setErrorMessage("An unexpected server error has occurred. Please accept our apologies for the inconvenience. We kindly ask you to try your request again later. Thank you for your understanding.")
          setAlertType('error')
          setTimeout(() => {router.push('https://immican.ai/')}, 5000);
        }
    })}
  };

  const handleEmptyFieldCheck = (email, password) => {
      if(email !== '' && password === ''){setOpenEmailAlert(false); setOpenPassAlert(true)}
      else if(email === '' && password !== ''){setOpenEmailAlert(true); setOpenPassAlert(false)}
      else{setOpenEmailAlert(true); setOpenPassAlert(true)}

      return email === '' || password === '';
  }

  const signedIn = async () => {
    const options = {email: email, password: password}
    return await postData('login/signIn', options);
  }

  const handleEmailVerify = async () => {
      setLoader(true)
      const options = {email: email}
      const data = await getData('mail/confirmationSend', options);
      // console.log('sara', data)
      setAlertType(data.status === 'failed'? 'error' : data.status)
      setErrorMessage(data.message)
      setOpenAlert(true)
      setSendLinkAgain(false)
      setLoader(false)
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box sx={{marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',  px: 2, py: 3}}>
        <Typography style={{fontSize: '36px', fontWeight: '700', color: '#012970', fontFamily: 'Nunito, sans-serif'}}
                    component="h3" variant="h3">
          <img style={{maxHeight: '34px', marginRight: '6px'}} src="/images/logo.png" alt="Logo Image" />ImmiCan</Typography>
      </Box>
      <Box sx={{marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: 3, borderRadius: 2, px: 4, py: 6}}>
        {/* --- Sign Up --- */}
        <Typography component="h1" variant="h5">Login to Your Account</Typography>
        <Typography component="p" variant="p">Enter your username & password to login</Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* --- Email Address --- */}
          <TextField error={openEmailAlert} margin="normal" required fullWidth id="email" label="Email Address"
                     name="email" autoComplete="email" autoFocus value={email}
                     onChange={(e)=>setEmail(e.target.value)} />
          {/* --- Password --- */}
          <TextField error={openPassAlert} margin="normal" required fullWidth name="password" label="Password"
              type={showPassword ? 'text' : 'password'} id="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          {/* --- Remember Me --- */}
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>

          {/* --- Sign In Button --- */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>

          {/* --- Forgot Password --- */}
          <Grid container>
            <Grid item xs={12} md={6}>
              <Link href='/forgetPassword' style={{cursor: 'pointer'}} variant="body2">Forgot password?</Link>
            </Grid>
            {/* --- Sign Up and Registration --- */}
            <Grid item xs={12} md={6}>
              <Link href='/register' style={{cursor: 'pointer'}} variant="body2">
                {"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {sendLinkAgain?
        <Box sx={{background: '#ff00004f!important', marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
          px: 2, py: 3}} style={{ background: '#ef53596'}}>
          {!loader?
            <Typography component="p" variant="p">{errorMessage}.
              <span onClick={()=>handleEmailVerify()} style={{color: 'blue',
                textDecoration: 'underline', cursor: 'pointer'}}> click here </span> to send the verification link again</Typography>
            :
            <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
              <CircularProgress color="secondary" />
            </Stack>
          }
        </Box>
          :null
      }

      {/* --- Footer --- */}
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  </ThemeProvider>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
