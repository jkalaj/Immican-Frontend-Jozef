// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React, {useContext, useEffect, useState} from "react";
import {getSingleData, postData} from "../../../../api/FetchData";
import {getFileDetails} from "../../../../@core/utils/CommonFunctions"
import {getLookUpData} from "../../../../api/CommonApi";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import DescriptionAlerts from "../../../../@core/utils/alert";
import {StateContext} from "../../../../@core/context/stateContext";


const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [countryResidence, setCountryResidence] = useState('');
  const [twitterProfile, setTwitterProfile] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');
  const [instagramProfile, setInstagramProfile] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [address, setAddress] = useState('');
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [image, setImage] = useState('/images/profile.png')
  const [openAlert, setOpenAlert] = useState(false)
  const [countryList, setCountryList] = useState([]);
  const { setValues } = useContext(StateContext)

  const profilePicture = async () =>{
    const documents = await getFileDetails()
    console.log('documents', documents)
    documents.forEach(file => {
      if (file.documentType === 'profile_picture') {
        if(file.imageUrl !== null || file.imageUrl !== ''){
        setImage(file.imageUrl)
        }
      }
    });
  }
  const getImmigrantData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('user/getImmigrantDetails', '', userToken);
  }

  const updateProfessionalDetails = async (e) => {
    e.preventDefault();

    const options = {
      firstName: firstName, lastName: lastName, email: email, phone: phone, countryResidence: countryResidence,
      about: about, linkedinProfile: linkedinProfile, address: address, twitterProfile: twitterProfile,
      facebookProfile: facebookProfile, instagramProfile: instagramProfile}

    const data = await postData('user/updateImmigrantData', options);
    if(data.status === 'success'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('success')
      setValues({
        firstName: firstName, lastName: lastName, email: email, phone: phone, country: countryResidence,
        about: about, linkedinProfile: linkedinProfile, address: address, twitterProfile: twitterProfile,
        facebookProfile: facebookProfile, instagramProfile: instagramProfile
      })
    }
    else if(data.status === 'failed'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')
    }
  }

  useEffect(() => {
    getLookUpData('3', '1').then((data)=> setCountryList(data.data))
    getImmigrantData().then((data)=>{
       // console.log('data', data)
       setFirstName(data.firstName)
       setLastName(data.lastName)
       setEmail(data.email)
       setPhone(data.phone)
       setCountryResidence(data.countryResidence)
       setAbout(data.about)
       setAddress(data.address)
       setTwitterProfile(data.twitterProfile)
       setFacebookProfile(data.facebookProfile)
       setInstagramProfile(data.instagramProfile)
       setLinkedinProfile(data.linkedinProfile)
    })
    profilePicture()
  }, []);

  return (
    <Card style={{marginTop: '10px'}}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
      <CardHeader title='Edit Profile' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Box component="form" onSubmit={updateProfessionalDetails} noValidate sx={{ mt: 1 }}>

          <Grid container spacing={4}>
            {/* --- image --- */}

            <Grid item md={2} xs={12} style={{paddingRight: '15px', marginBottom: '5px'}}>
              <Typography className="paddingLevel" component="p" variant="p">Profile Image</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <img src={image} alt="Profile picture"/>
                </div>
              </div>
            </Grid>
            {/* --- First Name --- */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">First Name</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" required fullWidth id="firstName" label="First Name"
                         name="firstName" autoComplete="firstName" autoFocus value={firstName}
                         onChange={(e)=>setFirstName(e.target.value)}/>
            </Grid>
            {/* --- Last Name --- */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Last Name</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" required fullWidth id="lastName" label="Last Name"
                         name="lastName" autoComplete="lastName" autoFocus value={lastName}
                         onChange={(e)=>setLastName(e.target.value)}/>
            </Grid>
            {/* About */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">About</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField fullWidth multiline minRows={3} label='About *' placeholder='Bio...' value={about}
                         onChange={(e)=>setAbout(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}/>
            </Grid>
            {/* Country */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Country</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControl fullWidth>
                <InputLabel  id="demo-simple-select-label-Resi">Country *</InputLabel>
                <Select className="inputHeight" labelId="demo-simple-select-label-Resi" id="demo-simple-select-Resi"
                        value={countryResidence} label="Country" required
                        onChange={(event) => setCountryResidence(event.target.value)}>
                  {countryList.map((item) =>
                    // eslint-disable-next-line react/jsx-key
                    <MenuItem value={item.levelData}>{item.levelData}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            {/* Address */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Address</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" required fullWidth id="address" label="Address "
                         name="address" autoComplete="address" autoFocus value={address}
                         onChange={(e)=>setAddress(e.target.value)}/>
            </Grid>
            {/* Phone */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Phone</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" required fullWidth id="phone" label="Phone number"
                         name="phone" autoComplete="phone" autoFocus value={phone}
                         onChange={(e)=>setPhone(e.target.value)}/>
            </Grid>
            {/* Email */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Email</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" required fullWidth id="email" label="Email address"
                         name="email" autoComplete="email" autoFocus value={email}
                         onChange={(e)=>setEmail(e.target.value)}/>
            </Grid>
            {/* Twitter Profile */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Twitter Profile</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" fullWidth id="twitter" label="Twitter profile *"
                         name="twitter" autoComplete="twitter" autoFocus value={twitterProfile}
                         onChange={(e)=>setTwitterProfile(e.target.value)}/>
            </Grid>
            {/* Facebook Profile */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Facebook Profile</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" fullWidth id="facebook" label="Facebook profile *"
                         name="facebook" autoComplete="facebook" autoFocus value={facebookProfile}
                         onChange={(e)=>setFacebookProfile(e.target.value)}/>
            </Grid>
            {/* Instagram Profile */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Instagram Profile</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" fullWidth id="instagram" label="Instagram profile *"
                         name="instagram" autoComplete="instagram" autoFocus value={instagramProfile}
                         onChange={(e)=>setInstagramProfile(e.target.value)}/>
            </Grid>
            {/* Linkedin Profile */}
            <Grid item md={2} xs={12} className="paddingTopNone">
              <Typography className="paddingLevel" component="p" variant="p">Linkedin Profile</Typography>
            </Grid>
            <Grid item md={10} xs={12}>
              <TextField className="inputHeight" margin="normal" fullWidth id="linkedin" label="Linkedin profile *"
                         name="linkedin" autoComplete="linkedin" autoFocus value={linkedinProfile}
                         onChange={(e)=>setLinkedinProfile(e.target.value)}/>
            </Grid>
            <Grid item xs={12} style={{textAlign: 'center'}}>
            <Box sx={{gap: 5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'}}>
              <Button type='submit' variant='contained' size='large'>
                Save Changes
              </Button>
            </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EditProfile
