import React, {useEffect, useState} from 'react';
import {getLookUpData} from "../../../api/CommonApi";
import DescriptionAlerts from "../../../@core/utils/alert";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../../../@core/utils/footer";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextEditor from "../../../@core/components/textEditor/textEditor";
import Button from "@mui/material/Button";
import {postData} from "../../../api/FetchData";
const defaultTheme = createTheme();
const CreatePolicy = () => {
  const [policyDetails, setPolicyDetails] = useState('')
  const [policyTypeId, setPolicyTypeId] = useState('')
  const [policyList, setPolicyList] = useState([])
  const [openAlert, setOpenAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [alertType, setAlertType] = useState('')

  const reset= () =>{
    setPolicyDetails('')
    setPolicyTypeId('')
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()

    const options = {policyDetails: policyDetails, policyTypeId: policyTypeId}
    const data = await postData('settings/createPolicyData', options);
    if(data.status === 'success'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('success')
      reset()
    }
    else if(data.status === 'failed'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')
    }
  }
  const sendValue = (value) => setPolicyDetails(value);;
  useEffect(() => {
    getLookUpData('9', '1').then((data)=> setPolicyList(data.data))
  }, []);
  return (
    <ThemeProvider theme={defaultTheme}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box sx={{marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',  px: 2, py: 3}}>
          <Typography style={{fontSize: '36px', fontWeight: '700', color: '#012970', fontFamily: 'Nunito, sans-serif'}}
                      component="h3" variant="h3">Policy</Typography>
        </Box>
        <Box sx={{marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: 3, borderRadius: 2, px: 4, py: 6}}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* --- Policy Type --- */}
            <FormControl fullWidth style={{marginBottom: '15px'}}>
                <InputLabel  id="demo-simple-select-label-policy">Policy Type *</InputLabel>
                <Select className="inputHeight" labelId="demo-simple-select-label-policy" id="demo-simple-select-label-policy1"
                        value={policyTypeId} label="Policy Type" required
                        onChange={(event) => setPolicyTypeId(event.target.value)}>
                  {policyList.map((item) =>
                    <MenuItem value={item.id}>{item.levelData}</MenuItem>
                  )}
                </Select>
            </FormControl>
            {/* --- Policy Details --- */}
            <FormControl fullWidth>
                <TextEditor sendValue={sendValue} value={policyDetails} />
            </FormControl>
            {/* --- Add Button --- */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit</Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreatePolicy;
