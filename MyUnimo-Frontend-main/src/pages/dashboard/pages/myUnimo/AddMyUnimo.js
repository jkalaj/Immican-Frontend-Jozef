import React, {useEffect, useState} from 'react';
import DescriptionAlerts from "../../../../@core/utils/alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ViewMyUnimo from "./ViewMyUnimo";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import {getData, getSingleData, postData} from "../../../../api/FetchData";
import LinkIcon from '@mui/icons-material/Link';
import EmployeeList from "./employeeList";


const AddMyUnimo = () => {
  const [openAlert, setOpenAlert] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [myUnimoNo] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPortalLink, setClientPortalLink] = useState('')
  const [serviceStepsId, setServiceStepsId] = useState('')
  const [serviceList, setServiceList] = useState([])
  const [categorySteps, setCategorySteps] = useState([])
  const [isCopied, setIsCopied] = useState(false);
  const [link, setLink] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [stepNo, setStepNo] = useState(0);
  const [open, setOpen] = useState(false);

  const getMyServiceData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('service/getMyService', '', userToken);
  }

  const handleCategorySteps = (e) =>{
    serviceList.map((item)=>{
      if (e.target.value === item.id){
        setCategorySteps(item.serviceList)
        setServiceName(item.service)
      }
    })
  }

  const handleSubCategorySteps = (e) =>{
    categorySteps.map((item)=>{
      if (e.target.value === item.id){
        setStepNo(item.labelNo)
      }
    })
  }

  const validationCheck = (e) =>{
    if(serviceId !== '' && serviceStepsId !== '' && clientEmail !== '' &&  meetingLink !== '' ) {
      e.preventDefault()
      sendInvitation()
    } else {
      setOpenAlert(true)
      setErrorMessage('Fill up all the mandatory fields')
      setAlertType('error')
    }
  }

  const mailSend = async (id) =>{
    const options = {serviceName: serviceName, id: id, email: clientEmail, meetingLink: meetingLink}
    return await getData('myunimo/invitationSend', options);
  }

  const sendInvitation = async () => {
      // console.log('stepNo', stepNo)
      const options = {serviceName: serviceName, serviceId: serviceId, serviceStepsId: serviceStepsId,
                            employeeName: employeeName, clientEmail: clientEmail, clientPortalLink: clientPortalLink,
                            myUnimoNo: myUnimoNo, stepNo: stepNo, meetingLink: meetingLink}

      const data = await postData('myunimo/saveClientInvitation', options);
      // console.log('data', data)
      if(data.status === 'success'){
        setOpenAlert(true)
        setErrorMessage(data.message)
        setAlertType('success')
        mailSend(data.id).then((data)=> setLink(data.data))
        resetFields()
      }
      else if(data.status === 'failed'){
        setOpenAlert(true)
        setErrorMessage(data.message)
        setAlertType('error')
      }
  }

  const resetFields = () =>{
    setServiceName('')
    setServiceId('')
    setClientEmail('')
    setClientPortalLink('')
    setServiceStepsId('')
    setCategorySteps([])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
      .then(() => {setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000)})
      .catch(error => console.error('Error copying to clipboard:', error));
  };
  const handleClose = () => {
    setOpen(false);
  };
  const saveButton = (name) =>{
    setEmployeeName(name)
  }
  useEffect(() => {
    getMyServiceData().then((data)=>{
      // console.log('Data',data)
      setServiceList(data)
    })
  }, []);

  return (
    <Grid container spacing={4}>
      {open?
        <EmployeeList handleClose={handleClose} open={open} saveButton={saveButton} />:null
      }
      {openAlert ? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
      <Grid item md={4} xs={12}>
        <Card style={{marginTop: '10px'}}>
          <div style={{borderBottom: '1px solid #ccc'}}>
            <CardHeader title='Add MyUnimo' titleTypographyProps={{ variant: 'h6' }} />
          </div>
          <CardContent>
            <Box sx={{ maxWidth: '100%' }} md={{ maxWidth: '100%'}}>
              <Grid container spacing={4}>
                  <Grid item md={12} xs={12} className="paddingTopNone">
                    {/* --- My Unimo --- */}
                    <Typography className="titleDesign" component="h6" variant="h6" >MyUnimo #:</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <TextField size="small" disabled fullWidth id="myUnimoNo" name='myUnimoNo'
                               value={myUnimoNo} className="disableColor"/>
                  </Grid>

                  <Grid item md={12} xs={12} className="paddingTopNone">
                    {/* ---Service Name --- */}
                    <Typography className="titleDesign" component="h6" variant="h6" >Service Name:</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <TextField size="small" disabled fullWidth id="serviceName" placeholder="Service Name" name='serviceName'
                               value={serviceName} className="disableColor"/>
                  </Grid>

                  <Grid item md={12} xs={12} className="paddingTopNone" style={{paddingBottom: '6px'}}>
                    {/* ---Category service Name --- */}
                    <Typography className="titleDesign" component="h6" variant="h6" >Select a category for the service:</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <FormControl fullWidth size="small" style={{marginBottom: '15px'}}>
                      <InputLabel id="demo-select-small">Select a Category *</InputLabel>
                      <Select labelId="demo-select-small" id="demo-select" value={serviceId} label="Select a Category" required
                              onChange={(e)=>{setServiceId(e.target.value);handleCategorySteps(e)}}>
                        {serviceList.map((item)=>
                          <MenuItem value={item.id}>{item.service} | {item.subCategoryName} | {item.version}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-select-small-label">Show Service Category Steps *</InputLabel>
                      <Select labelId="demo-select-small-label" id="demo-select-small" value={serviceStepsId} required
                              label="Show Service Category Steps"
                              onChange={(e)=>{setServiceStepsId(e.target.value); handleSubCategorySteps(e)}}>
                        {categorySteps.map((item)=>
                          <MenuItem value={item.id}>{item.labelName}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={12} xs={12} className="paddingTopNone">
                    {/* ---Client Email --- */}
                    <Typography className="titleDesign" component="h6" variant="h6" >Client email address: *</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <TextField size="small" fullWidth id="clientEmailAddress" placeholder="Client email address"
                               name='clientEmailAddress' value={clientEmail} required
                               onChange={(e)=>setClientEmail(e.target.value)}/>
                  </Grid>

                  <Grid item md={12} xs={12} className="paddingTopNone">
                    {/* ---Calendar user --- */}
                    <Typography className="titleDesign" component="h6" variant="h6" >Select a employee:</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <TextField size="small" fullWidth id="employee" name='employee' value={employeeName} onClick={()=>setOpen(true)}/>
                  </Grid>

                  <Grid item md={12} xs={12} className="paddingTopNone">
                    {/* ---Client Portal Link --- */}
                    <Typography className="titleDesign" component="h6" variant="h6">Client Portal Link:</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} className="paddingTop">
                    <TextField size="small" fullWidth id="clientPortalLink" name='clientPortalLink' value={clientPortalLink}
                               onChange={(e)=> setClientPortalLink(e.target.value)} />
                  </Grid>
                {link !== ''?
                  <>
                    <Grid item md={1} xs={1}>
                      <LinkIcon />
                    </Grid>
                    <Grid item md={11} xs={11} className="paddingTop">
                      <p onClick={copyToClipboard} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
                        Copy invitation link</p>{isCopied && <p style={{ color: 'green' }}>Copied!</p>}
                    </Grid>
                  </>:null
                }
                <Grid item md={12} xs={12} className="paddingTopNone">
                  {/* ---Client Portal Link --- */}
                  <Typography className="titleDesign" component="h6" variant="h6">Meeting Link *:</Typography>
                </Grid>
                <Grid item md={12} xs={12} className="paddingTop">
                  <TextField size="small" fullWidth id="meetingLink" name='meetingLink' value={meetingLink}
                             onChange={(e)=> setMeetingLink(e.target.value)} />
                </Grid>
                  <Grid item md={12} xs={12} className="paddingTopNone">
                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}
                    onClick={(e)=>validationCheck(e)}> + Invite</Button>
                  </Grid>

              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={8} xs={12}>
        <Card style={{marginTop: '10px', height: '100%'}}>
          <div style={{borderBottom: '1px solid #ccc'}}>
            <CardHeader title='View MyUnimo' titleTypographyProps={{variant: 'h6'}}
                        style={{boarderBottom: '1px solid #ccc'}}/>
          </div>
          <CardContent>
            <ViewMyUnimo/>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default AddMyUnimo;
