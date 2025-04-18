import React, { useState, useEffect } from 'react';
import {Grid, TextField, FormControl, InputLabel, MenuItem,
  Select, OutlinedInput, InputAdornment, IconButton,
  Button, Box, Link} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import {getLookUpData} from "../../api/CommonApi";
import {isValidEmail} from "../../@core/utils/CommonFunctions";
import {getData, postData} from '../../api/FetchData';
import DescriptionAlerts from '../../@core/utils/alert';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ReCAPTCHA from "react-google-recaptcha";
import Checkbox from "@mui/material/Checkbox";


const ProfessionalSignUp = (props) => {
  // ** States
  const [captcha, setCaptcha] = React.useState(null);
  const [captchaKey] = React.useState('6Ld5j2YpAAAAAGh_SxA-RUZvVY73Qi4RSgfB7G7d');
  const [captchaError, setCaptchaError] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType] = useState('Professional');
  const [companyLegalName, setCompanyLegalName] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Alert Variable
  const [openEmailAlert, setOpenEmailAlert] = useState(false);
  const [openPhoneAlert, setOpenPhoneAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false)
  const [terms, setTerms] = useState(false)
  const [termsError, setTermsError] = useState(false)

  // Password Matching Regular Expression
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickConfirmShowPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();



const handleSubmit = (event) => {
    event.preventDefault();
  if (terms && captcha) {
    // Email Validation Check
    if (!isValidEmail(email)) {
      setOpenEmailAlert(true)
    } else {
      setOpenEmailAlert(false)
    }

    // Phone Validation Check
    if (!isValidPhoneNumber(phone.toString())) {
      setOpenPhoneAlert(true);
    } else {
      setOpenPhoneAlert(false);
    }

    if (!openEmailAlert && !openPhoneAlert) {
      registrationSave().then((data) => {
        if (data.status === 'success') {
          confirmationMail().then((data) => console.log(data))
          resetFormFields()
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('success')
        } else if (data.status === 'failed') {
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')
        }
        // console.log(data)
      })
    }
    setCaptchaError(false)
  } else {
    if (!captcha) setCaptchaError(true)
    else setTermsError(true)
  }
};

const resetFormFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setCompanyLegalName('');
    setSelectedQuestions([]);
    setSelectedAnswers([]);
    setValidPwd(false);
    setPwdFocus(false);
    setValidMatch(false);
    setMatchFocus(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOpenEmailAlert(false);
    setOpenPhoneAlert(false);
};

const registrationSave = async () => {
    const options = {
        firstName: firstName, lastName: lastName, email: email, phone: phone, userType: userType,
        confirmPassword: confirmPassword, password: password, companyLegalName:companyLegalName,
        selectedQuestions:selectedQuestions, selectedAnswers: selectedAnswers}

    return await postData('login/signUp', options);
}

const confirmationMail = async () => {
    const options = {email: email}

    return await getData('mail/confirmationSend', options);
}


  useEffect(() => {
    // Fetch all available security questions
    getLookUpData('6', '1').then((data) => {
      const allQuestions = data.data.map((item) => item.levelData);
      setAvailableQuestions(allQuestions);
    });
  }, []);

  const handleSecurityQuestionChange = (event, questionNumber) => {
    const selectedQuestion = event.target.value;

    // Update the selected questions state for the specific question number
    setSelectedQuestions((prevSelectedQuestions) => {
      const updatedSelectedQuestions = [...prevSelectedQuestions];
      updatedSelectedQuestions[questionNumber - 1] = selectedQuestion;

      return updatedSelectedQuestions;
    });

    // Update the available questions state by filtering out the selected question
    setAvailableQuestions((prevAvailableQuestions) =>
      prevAvailableQuestions.filter((question) => question !== selectedQuestion)
    );
  };

  const handleAnswerChange = (event, questionNumber) => {
    const answer = event.target.value;

    // Update the selected answers state for the specific question number
    setSelectedAnswers((prevSelectedAnswers) => {
      const updatedSelectedAnswers = [...prevSelectedAnswers];
      updatedSelectedAnswers[questionNumber - 1] = answer;

      return updatedSelectedAnswers;
    });
  };

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);


  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
    <Grid container spacing={2}>
      {/* --- First Name --- */}
      <Grid item xs={12} sm={6}>
        <TextField onChange={(event) => setFirstName(event.target.value)}
          autoComplete="given-name" required name="firstName"
          value={firstName} fullWidth id="firstName" label="First Name" autoFocus/>
      </Grid>

      {/* --- Last Name --- */}
      <Grid item xs={12} sm={6}>
        <TextField onChange={(event) => setLastName(event.target.value)}
          value={lastName} required fullWidth id="lastName" label="Last Name"
          name="lastName" autoComplete="family-name"/>
      </Grid>

      {/* --- Email --- */}
      <Grid item xs={12}>
        <TextField
          error={openEmailAlert}
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
      </Grid>

      {/* --- Phone --- */}
      <Grid item xs={12}>
        <PhoneInput
          className={openPhoneAlert ? 'errorBox PhoneBox' : 'PhoneBox'}
          placeholder="Phone * "
          value={phone}
          onChange={setPhone}
        />
      </Grid>

      {/* --- Password --- */}
      <Grid item xs={12}>
        <FormControl variant="outlined" style={{ width: '100%' }}>
          <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            required
            fullWidth
            name="password"
            value={password}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            aria-invalid={validPwd ? 'false' : 'true'}
            aria-describedby="pwdnote"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Grid>

      {/* --- Password Error Message --- */}
      <p id="pwdnote" className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
        1. 8 to 24 characters.
        <br />
        2. Must include uppercase and lowercase letters, a number and a special character.
        <br />
        3. Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span>{' '}
        <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
      </p>

      {/* --- Confirm Password --- */}
      <Grid item xs={12}>
        <FormControl variant="outlined" style={{ width: '100%' }}>
          <InputLabel htmlFor="outlined-adornment-confirm-password" style={{ paddingRight: '5px' }}>
            Confirm Password *
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            fullWidth
            name="confirmPassword"
            value={confirmPassword}
            autoComplete="confirm-password"
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickConfirmShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password * "
          />
        </FormControl>
      </Grid>

      {/* --- Confirm Password Error Message --- */}
      <p id="confirmnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
        Password and Confirm Password not match.
      </p>

      {/* --- Company Legal Name --- */}
      <Grid item xs={12}>
        <TextField
          onChange={(event) => setCompanyLegalName(event.target.value)}
          value={companyLegalName}
          required
          fullWidth
          id="companyLegalName"
          label="Company Legal Name"
          name="companyLegalName"
          autoComplete="companyLegalName"
        />
      </Grid>

      {/* --- Security Questions --- */}
      {[1, 2, 3].map((questionNumber) => (
          <Grid item xs={12} key={questionNumber}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>{`Security Question ${questionNumber}*`}</InputLabel>
              <Select
              value={selectedQuestions[questionNumber - 1] || ''}
              label={`Security Question ${questionNumber}*`}
              required
              onChange={(event) => handleSecurityQuestionChange(event, questionNumber)}
              renderValue={(selected) => selected}
              >
              {availableQuestions.map((availableQuestion) => (
                  <MenuItem key={availableQuestion} value={availableQuestion}>
                  {availableQuestion}
                  </MenuItem>
              ))}
              </Select>
          </FormControl>
          <TextField
              fullWidth
              label={`Answer ${questionNumber}`}
              required
              value={selectedAnswers[questionNumber - 1] || ''}
              onChange={(event) => handleAnswerChange(event, questionNumber)}
          />
          </Grid>
      ))}

      <Grid item xs={12}>
        {/* --- Terms and condition --- */}
        <Checkbox checked={terms} onChange={(e)=>{setTerms(e.target.checked); setTermsError(false)}}
                  inputProps={{ 'aria-label': 'controlled' }}/>
        <label htmlFor="terms">
          <Link href='/policy' target="_blank" rel="noopener noreferrer">
            Read the terms and conditions
          </Link>
          {termsError && <p style={{color: 'red'}}>Please read and check the terms and conditions</p>}
        </label>
      </Grid>

      <Grid item xs={12} className="captchaDesign">
        <ReCAPTCHA sitekey={captchaKey} onChange={setCaptcha}/>
        {captchaError && <p style={{color: 'red'}}>Please Fill up Captcha</p>}
      </Grid>

    </Grid>

    {/* --- Submit Button --- */}
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
      Sign Up
    </Button>
  </Box>
  )
}
ProfessionalSignUp.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ProfessionalSignUp
