import React, {useState, useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { postData } from '../../api/FetchData';
import Copyright from "../../@core/utils/footer";
import DescriptionAlerts from '../../@core/utils/alert';

import { useRouter } from 'next/router';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'


const theme = createTheme();

const ForgetPassword = (props) => {
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);  // Initialize as an empty array
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [stage, setStage] = useState('initial'); // 'initial', 'questions', 'answers'
  const [pwdFocus, setPwdFocus] = useState(false);

  const [openAlert, setOpenAlert] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter();

  // Password Matching Regular Expression
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleForgotPassword = () => {
    if (stage === 'initial') {
      passwordRetrieval().then((data) => {
        if (data.status === 'success') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('success')

          // props.alert('success', data.message);
          try {
            // Remove curly braces and split the string into an array using commas
            const questionsArray = data.security_questions.replace(/[{}]/g, '').split(',');

            // Remove double quotes from each element and trim spaces
            const formattedArray = questionsArray.map((question) => question.replace(/"/g, '').trim());

            // Filter out empty strings and check if the resulting array is valid
            const filteredArray = formattedArray.filter((question) => question !== '');

            if (Array.isArray(filteredArray) && filteredArray.length > 0) {
              setSelectedQuestions(filteredArray);
              setStage('questions');
            } else {
              setOpenAlert(true)
              setErrorMessage('Invalid data received for security questions')
              setAlertType('error')

              // props.alert('error', 'Invalid data received for security questions');
            }
          } catch (error) {
            setOpenAlert(true)
            setErrorMessage('Error parsing security questions')
            setAlertType('error')

            // props.alert('error', 'Error parsing security questions');
          }
        } else if (data.status === 'failed') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')

          // props.alert('error', data.message);
        }
      });
    } else if (stage === 'questions') {
      securityQuestionsCheck().then((data) => {
        if (data.status === 'success') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('success')

          // props.alert('success', data.message);
          setStage('answers');
        } else if (data.status === 'failed') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')

          // props.alert('error', data.message);
        }
      });
    } else if (stage === 'answers') {
      submitNewPassword().then((data) => {
        if (data.status === 'success') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('success')

          // props.alert('success', data.message);

          // Redirect to the login page
          router.replace('/login');

          setStage('initial');
          setEmail('');

          // Set the type to 'signIn' to display the sign-in component
          // props.setType('signIn');
        } else if (data.status === 'failed') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')

          // props.alert('error', data.message);
        }
      });
    }
  };



  const passwordRetrieval = async () => {
    const options = { email: email };
    const data = await postData('login/forgotPassword', options);

    if (data.status === 'success') {
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('success')

      // props.alert('success', data.message);

      // Check if security_questions is an array before updating state
      if (Array.isArray(data.security_questions)) {
        setSelectedQuestions(data.security_questions);
        setStage('questions');
      } else {
        setOpenAlert(true)
        setErrorMessage('Invalid data received for security questions')
        setAlertType('error')

        // props.alert('error', 'Invalid data received for security questions');
      }
    } else if (data.status === 'failed') {
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')

      // props.alert('error', data.message);
    }

    return data;
  };

  const securityQuestionsCheck = async () => {
    const options = { email: email, selectedAnswers: selectedAnswers };
    const data = await postData('login/securityQuestionsCheck', options);

    if (data.status === 'success') {
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('success')

      // props.alert('success', data.message);

      // Check if security_questions is an array before updating state
    } else if (data.status === 'failed') {
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')

      props.alert('error', data.message);
    }

    return data;
  };

  const submitNewPassword = async () => {
    const options = {
      email: email,
      new_password: newPassword,
    };

    return await postData('login/changePassword', options);
  };

  return (
    <ThemeProvider theme={theme}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, py: 3 }}>
          <Typography style={{ fontSize: '36px', fontWeight: '700', color: '#012970', fontFamily: 'Nunito, sans-serif' }}
            component="h3" variant="h3">
            <img style={{ maxHeight: '34px', marginRight: '6px' }} src="/images/logo.png" alt="Logo Image" />ImmiCan
          </Typography>
        </Box>
        <Box sx={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3, borderRadius: 2, px: 4, py: 6 }}>
          {/* Forgot Password Form */}
          <Typography component="h1" variant="h5">Forgot Password</Typography>

          {/* Email Input */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          {/* Show Questions if in 'questions' stage */}
            {stage === 'questions' && (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 2 }} variant="body1">
                  Please answer the security questions to proceed.
                </Typography>
                <Grid container spacing={5}>
                  {selectedQuestions.map((question, index) => (
                    <Grid item xs={12} key={index}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor={`answer-${index + 1}`}>{question}</InputLabel>
                        <Input
                          id={`answer-${index + 1}`}
                          type="text"
                          value={selectedAnswers[index] || ''}
                          onChange={(e) => {
                            const newAnswers = [...selectedAnswers];
                            newAnswers[index] = e.target.value;
                            setSelectedAnswers(newAnswers);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </React.Fragment>
            )}


          {/* Show Password Input if in 'answers' stage */}
          {stage === 'answers' && (
          <React.Fragment>
            <Typography sx={{ mt: 2 }} variant="body1">
              Your answers are correct. Please enter your new password.
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="new-password">New Password</InputLabel>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {/* Password Error Message */}
            <p id="pwdnote" className={pwdFocus && !PWD_REGEX.test(newPassword) ? 'instructions' : 'offscreen'}>
              1. 8 to 24 characters.
              <br />
              2. Must include uppercase and lowercase letters, a number, and a special character.
              <br />
              3. Allowed special characters: <span aria-label="exclamation mark">!</span>{' '}
              <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{' '}
              <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
          </React.Fragment>
        )}


          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleForgotPassword}
          >
            {stage === 'answers' ? 'Submit New Password' : 'Submit'}
          </Button>

          {/* Back to Login Link */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Back to Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

ForgetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgetPassword
