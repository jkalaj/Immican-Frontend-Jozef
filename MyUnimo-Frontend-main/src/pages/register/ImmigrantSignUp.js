// React Imports
import React, {useState} from 'react';

// Mui Imports
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, Link, MenuItem, Select} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Import Files
import {getLookUpData} from "../../api/CommonApi";
import {isValidEmail} from "../../@core/utils/CommonFunctions";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import {getData, postData} from '../../api/FetchData';
import DescriptionAlerts from '../../@core/utils/alert';
import ReCAPTCHA from "react-google-recaptcha";

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Checkbox from "@mui/material/Checkbox";


const ImmigrantSignUp = (props) => {
  // ** States
  const [captcha, setCaptcha] = React.useState(null);
  const [captchaKey] = React.useState('6Ld5j2YpAAAAAGh_SxA-RUZvVY73Qi4RSgfB7G7d');
  const [captchaError, setCaptchaError] = useState(false)
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [age, setAge] = React.useState('');
  const [countryResidence, setCountryResidence] = React.useState('');
  const [referralSource, setReferralSource] = React.useState('');
  const [desiredDestination, setDesiredDestination] = React.useState('');
  const [maritalStatus, setMaritalStatus] = React.useState('');
  const [familyMembers, setFamilyMembers] = React.useState(0);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userType] = React.useState(props.regiType);
  const [validPwd, setValidPwd] = React.useState(false);
  const [pwdFocus, setPwdFocus] = React.useState(false);
  const [validMatch, setValidMatch] = React.useState(false);
  const [matchFocus, setMatchFocus] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Alert Variable
  const [openEmailAlert, setOpenEmailAlert] = React.useState(false)
  const [openPhoneAlert, setOpenPhoneAlert] = React.useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [terms, setTerms] = useState(false)
  const [termsError, setTermsError] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [destinationList, setDestinationList] = React.useState([]);
  const [referralSourceList, setReferralSourceList] = React.useState([]);
  const [countryList, setCountryList] = React.useState([]);
  const [maritalList, setMaritalList] = React.useState([]);

  const [ageList] = React.useState([
      {"age": "16"}, {"age": "17"}, {"age": "18"}, {"age": "19"}, {"age": "20"},
      {"age": "21"}, {"age": "22"}, {"age": "23"}, {"age": "24"}, {"age": "25"},
      {"age": "26"}, {"age": "27"}, {"age": "28"}, {"age": "29"}, {"age": "30"},
      {"age": "31"}, {"age": "32"}, {"age": "33"}, {"age": "34"}, {"age": "35"},
      {"age": "36"}, {"age": "37"}, {"age": "38"}, {"age": "39"}, {"age": "40"},
      {"age": "41"}, {"age": "42"}, {"age": "43"}, {"age": "44"}, {"age": "45"},
      {"age": "46"}, {"age": "47"}, {"age": "48"}, {"age": "49"}, {"age": "50"},
  ]);

  // Password Matching Regular Expression
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickConfirmShowPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

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

  const handleSubmit = (event) => {
      event.preventDefault();
    if (captcha && terms) {
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
          (data)
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
      setAge('');
      setCountryResidence('');
      setReferralSource('');
      setDesiredDestination('');
      setMaritalStatus('');
      setFamilyMembers(0);
      setPassword('');
      setConfirmPassword('');
      setValidPwd(false);
      setPwdFocus(false);
      setValidMatch(false);
      setMatchFocus(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setOpenEmailAlert(false);
      setOpenPhoneAlert(false);
      setCaptchaError(false)
      setSelectedQuestions([]);
      setSelectedAnswers([]);
  };

  const registrationSave = async () => {
      const options = {
          firstName: firstName, lastName: lastName, email: email, phone: phone, age: age, userType: userType,
          countryResidence: countryResidence, desiredDestination: desiredDestination, maritalStatus: maritalStatus,
          familyMembers: familyMembers, referralSource: referralSource, confirmPassword: confirmPassword,
          password: password, selectedQuestions:selectedQuestions, selectedAnswers: selectedAnswers}
      return await postData('login/signUp', options);
  }

  const confirmationMail = async () => {
      const options = {email: email}
      return await getData('mail/confirmationSend', options);
  }

  React.useEffect(() => {
      getLookUpData('1', '1').then((data)=> setDestinationList(data.data))
      getLookUpData('2', '1').then((data)=> setReferralSourceList(data.data))
      getLookUpData('3', '1').then((data)=> setCountryList(data.data))
      getLookUpData('5', '1').then((data)=> setMaritalList(data.data))
      getLookUpData('6', '1').then((data) => {
          const allQuestions = data.data.map((item) => item.levelData);
          setAvailableQuestions(allQuestions);
      });
  }, []);

  React.useEffect(() => {
      setValidPwd(PWD_REGEX.test(password));
      setValidMatch(password === confirmPassword);
  }, [password, confirmPassword, PWD_REGEX])

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
        <Grid container spacing={2}>
            {/* --- First Name --- */}
            <Grid item xs={12} sm={6}>
                <TextField onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name"
                            required name="firstName" value={firstName} fullWidth id="firstName" label="First Name" autoFocus/>
            </Grid>

            {/* --- Last Name --- */}
            <Grid item xs={12} sm={6}>
                <TextField onChange={(event) => setLastName(event.target.value)} value={lastName}
                            required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="family-name"/>
            </Grid>

            {/* --- Email --- */}
            <Grid item xs={12}>
                <TextField error={openEmailAlert} onChange={(event) => setEmail(event.target.value)} value={email}
                            required fullWidth id="email" label="Email Address" name="email" autoComplete="email"/>
            </Grid>

            {/* --- Phone --- */}
            <Grid item xs={12}>
                {/*<TextField onChange={(event) => setPhone(event.target.value)} value={phone}
                            required fullWidth id="phone" label="Phone Number" name="phone" autoComplete="phone"/>*/}
                <PhoneInput className={openPhoneAlert?"errorBox PhoneBox" : "PhoneBox"} placeholder="Phone * "
                            value={phone} onChange={setPhone}/>
            </Grid>

            {/* --- Age --- */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label-age">Age *</InputLabel>
                    <Select labelId="demo-simple-select-label-age" id="demo-simple-select-age" value={age} label="Age *"
                            required onChange={(event) => setAge(event.target.value)}>
                        {ageList.map((item) =>
                          // eslint-disable-next-line react/jsx-key
                            <MenuItem value={item.age}>{item.age}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* --- Country --- */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label-Resi" style={{background: 'white', paddingRight: '8px'}}>Country of Residence *</InputLabel>
                    <Select labelId="demo-simple-select-label-Resi" id="demo-simple-select-Resi" value={countryResidence} label="countryResidence"
                            required onChange={(event) => setCountryResidence(event.target.value)}>
                        {countryList.map((item) =>
                          // eslint-disable-next-line react/jsx-key
                            <MenuItem value={item.levelData}>{item.levelData}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* --- Your Desired Destination --- */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" style={{background: 'white', paddingRight: '8px'}}>Your
                        Desired Destination *</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select"
                            value={desiredDestination} label="Desired Destination *" required
                            onChange={(event) => setDesiredDestination(event.target.value)}>
                        {destinationList.map((item) =>
                          // eslint-disable-next-line react/jsx-key
                            <MenuItem value={item.levelData}>{item.levelData}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* --- Marital Status --- */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-marital" style={{background: 'white', paddingRight: '8px'}}>Your
                        Marital Status *</InputLabel>
                    <Select labelId="demo-simple-select-marital" id="demo-simple-select-marital"
                            value={maritalStatus} label="Marital Status *" required
                            onChange={(event) => setMaritalStatus(event.target.value)}>
                            {maritalList.map((item) =>
                              // eslint-disable-next-line react/jsx-key
                                <MenuItem value={item.levelData}>{item.levelData}</MenuItem>
                            )}
                    </Select>
                </FormControl>
            </Grid>
            {/* --- Family Member --- */}
            {maritalStatus === "Married"?
            <Grid item xs={12}>
                <TextField onChange={(event) => setFamilyMembers(event.target.value)} value={familyMembers}
                            fullWidth id="familyMembers" label="Number Of Family Members " name="familyMembers" autoComplete="phone"/>
            </Grid>:null}

            {/* --- Referral source --- */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label-Ref">Referral source</InputLabel>
                    <Select labelId="demo-simple-select-label-Ref" id="demo-simple-select-Ref"
                            value={referralSource} label="Referral Source"
                            onChange={(event) => setReferralSource(event.target.value)}>
                        {referralSourceList.map((item) =>
                          // eslint-disable-next-line react/jsx-key
                          <MenuItem value={item.levelData}>{item.levelData}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* --- Password --- */}
            <Grid item xs={12}>
                <FormControl variant="outlined" style={{width: '100%'}}>
                    <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                    <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'}
                                    required fullWidth name="password" value={password}
                                    onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)}
                                    aria-invalid={validPwd ? "false" : "true"} aria-describedby="pwdnote"
                                    autoComplete="new-password" onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    } label="Password"
                    />
                </FormControl>
            </Grid>

            {/* --- Password Error Message --- */}
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                1. 8 to 24 characters.<br/>
                2. Must include uppercase and lowercase letters, a number and a special character.<br/>
                3. Allowed special characters: <span aria-label="exclamation mark">!</span> <span
                aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span
                aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            {/* --- Confirm Password --- */}
            <Grid item xs={12}>
                <FormControl variant="outlined" style={{width: '100%'}}>
                    <InputLabel htmlFor="outlined-adornment-confirm-password" style={{paddingRight: '5px'}}>Confirm Password *</InputLabel>
                    <OutlinedInput id="outlined-adornment-confirm-password" type={showConfirmPassword ? 'text' : 'password'}
                                    required fullWidth name="confirmPassword" value={confirmPassword}
                                    autoComplete="confirm-password" aria-invalid={validMatch ? "false" : "true"} aria-describedby="confirmnote"
                                    onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickConfirmShowPassword}
                                                        onMouseDown={handleMouseDownPassword} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    } label="Confirm Password * "
                    />
                </FormControl>
            </Grid>
            {/* --- Confirm Password Error Message --- */}
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                Password and Confirm Password not match.
            </p>

            {/* --- Security Questions --- */}
            {[1, 2, 3].map((questionNumber) => (
                <Grid item xs={12} key={questionNumber}>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>{`Security Question ${questionNumber}*`}</InputLabel>
                        <Select value={selectedQuestions[questionNumber - 1] || ''}
                            label={`Security Question ${questionNumber}*`} required
                            onChange={(event) => handleSecurityQuestionChange(event, questionNumber)}
                            renderValue={(selected) => selected}>
                            {availableQuestions.map((availableQuestion) => (
                                <MenuItem key={availableQuestion} value={availableQuestion}>
                                    {availableQuestion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth label={`Answer ${questionNumber}`} required value={selectedAnswers[questionNumber - 1] || ''}
                        onChange={(event) => handleAnswerChange(event, questionNumber)}/>
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
            {captchaError && <p style={{color: 'red'}}>Please fill up captcha</p>}
          </Grid>
        </Grid>

        {/* --- Submit Button --- */}
        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>Sign Up</Button>
    </Box>
  )
}
ImmigrantSignUp.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ImmigrantSignUp
