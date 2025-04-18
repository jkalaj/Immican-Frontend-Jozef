import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from '@mui/material/Grid'
import Typography from "@mui/material/Typography";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import {getLookUpData, getLookUpDataWithParentId} from "../../../../api/CommonApi";
import {handleOnChangeList} from "../../../../@core/utils/CommonFunctions";
import { postData } from "../../../../api/FetchData";
import DescriptionAlerts from "../../../../@core/utils/alert";
import ViewServices from "./ViewServices";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextEditor from '../../../../@core/components/textEditor/textEditor'


export default function MyService() {
  const [steps, setSteps] = React.useState([
    {id: '1', labelNo: 1, labelName: 'Discovery Call', labelDetails: ''},
    {id: '2', labelNo: 2, labelName: 'Request for Proposal (RFP)', labelDetails: ''},
    {id: '3', labelNo: 3, labelName: 'Request Date of Entry (RDE)', labelDetails: ''},
    {id: '4', labelNo: 4, labelName: 'Edit Content', labelDetails: ''},
    {id: '5', labelNo: 5, labelName: 'Invoice', labelDetails: ''}])
  const [activeStep, setActiveStep] = React.useState(steps.length);
  const [selectCategory, setSelectCategory] = React.useState('');
  const [selectSubCategory, setSelectSubCategory] = React.useState('');
  const [selectVersion, setSelectVersion] = React.useState('');
  const [categoryList, setCategoryList] = React.useState([]);
  const [subCategoryList, setSubCategoryList] = React.useState([]);
  const [serviceName, setServiceName] = React.useState('');
  const [serviceId, setServiceId] = React.useState('');

  const [update, setUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [open, setOpen] = React.useState(false);
  const [stepName, setStepName] = React.useState('');
  const [stepNumber, setStepNumber] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState({});
  const [stepLabelDetails, setStepLabelDetails] = React.useState('');


  const sendValue = (value) => {
    setStepLabelDetails(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (key, step) => {
    setOpen(true);
    setStepName(step.labelName);
    setStepNumber(step.labelNo);
    setStepLabelDetails(step.labelDetails);
    setCurrentStep(step);
  };

  const handleAddSteps = (e) => {
    e.preventDefault()
    const newSteps = [...steps]
    newSteps.push({id: newSteps.length + 1, labelName: '', labelDetails: '', labelNo: newSteps.length + 1, save: true})
    setSteps(newSteps);
  };

  const handleRemoveSteps = (index) => {
    const newSteps = [...steps]
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSubCategory = (parentId) =>{
    const newList = [...categoryList]
    newList.map((item) =>{
      if(item.id === parentId){
        setServiceName(item.levelData)
      }
    })
    getLookUpDataWithParentId('8', '2', parentId).then((data)=> setSubCategoryList(data.data))
  }

  const handleOnChange = (event, row, nameValue) =>{
    // console.log('sad', event.target.value, row, steps, nameValue)
    const newList = handleOnChangeList(event.target.value, row, steps, nameValue)
    setSteps(newList)
  }

  const stepSet = (row, nameValue) =>{
    const newList = handleOnChangeList(stepLabelDetails, row, steps, nameValue)
    setSteps(newList)
  }

  const handleEditData = (service) =>{
     // console.log(service)
    setSteps(service.serviceList)
    setActiveStep(service.serviceList.length)
    setSelectSubCategory(service.subCategoryId)
    setSelectCategory(service.categoryId)
    setSelectVersion(service.version)
    setServiceName(service.service)
    setUpdate(true)
    setServiceId(service.id)
    handleSubCategory(service.categoryId)
  }

  const inputValidation = () => {
    if(selectCategory === '') return false
    else if(selectSubCategory === '') return false
    else return selectVersion !== '';
  }

  const myServiceSave = async (e) => {
    e.preventDefault()
    let valid = inputValidation()

    if(valid){
      const allLabelDetailsNotEmpty = steps.every(item => item.labelDetails.replace(/<(.|\n)*?>/g, '').trim().length !== 0);
      // console.log(allLabelDetailsNotEmpty);

      if(allLabelDetailsNotEmpty){
        const options = {service: serviceName, categoryId: selectCategory, subCategoryId: selectSubCategory,
          myServiceDetails: steps, version: selectVersion}

        const data = await postData('service/saveMyService', options);
        // console.log('data', data)
        if(data.status === 'success'){
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('success')
          resetData()
        }
        else if(data.status === 'failed'){
          setOpenAlert(true)
          setErrorMessage(data.message)
          setAlertType('error')
        }
      } else {
        setOpenAlert(true)
        setErrorMessage('Please fill up all the mandatory fields')
        setAlertType('error')
      }
    }
    else {
      setOpenAlert(true)
      setErrorMessage('Please fill up all the mandatory fields')
      setAlertType('error')
    }
  }

  const myServiceUpdate = async (e) => {
    e.preventDefault()
    let valid = inputValidation()

    if(valid){
      const allLabelDetailsNotEmpty = steps.every(item => item.labelDetails.replace(/<(.|\n)*?>/g, '').trim().length !== 0);
      // console.log(allLabelDetailsNotEmpty);

      if(allLabelDetailsNotEmpty){
    const options = {service: serviceName, categoryId: selectCategory, subCategoryId: selectSubCategory,
                          myServiceDetails: steps, version: selectVersion, serviceId: serviceId}

    const data = await postData('service/updateMyService', options);
    // console.log('data', data)
    if(data.status === 'success'){
      setOpenAlert(true)
      setUpdate(false)
      setErrorMessage(data.message)
      setAlertType('success')
      resetData()
    }
    else if(data.status === 'failed'){
      setOpenAlert(true)
      setErrorMessage(data.message)
      setAlertType('error')
    }
      } else {
        setOpenAlert(true)
        setErrorMessage('Please fill up all the mandatory fields')
        setAlertType('error')
      }
    }
    else {
      setOpenAlert(true)
      setErrorMessage('Please fill up all the mandatory fields')
      setAlertType('error')
    }
  }

  const resetData = () => {
    setSteps([{id: '1', labelNo: 1, labelName: 'Discovery Call', labelDetails: ''},
      {id: '2', labelNo: 2, labelName: 'Request for Proposal (RFP)', labelDetails: ''},
      {id: '3', labelNo: 3, labelName: 'Request Date of Entry (RDE)', labelDetails: ''},
      {id: '4', labelNo: 4, labelName: 'Edit Content', labelDetails: ''},
      {id: '5', labelNo: 5, labelName: 'Invoice', labelDetails: ''}])
    setSelectSubCategory('')
    setSelectCategory('')
    setSelectVersion('')
    setServiceName('')
  }

  useEffect(() => {
    getLookUpData('8', '1').then((data)=> setCategoryList(data.data))
  }, []);


  return (
    <Grid container spacing={4}>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle>
          {stepNumber}. {stepName}
        </DialogTitle>
        <DialogContent>
          <TextEditor sendValue={sendValue} value={stepLabelDetails} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={()=>{handleClose();stepSet(currentStep, 'labelDetails')}} autoFocus>Done</Button>
        </DialogActions>
      </Dialog>
        <Grid item md={5} xs={12}>
            <Card style={{marginTop: '10px'}}>
              <div style={{borderBottom: '1px solid #ccc'}}>
                <CardHeader title='Add My Service' titleTypographyProps={{ variant: 'h6' }} />
              </div>
              <CardContent>
                 <Box sx={{ maxWidth: '100%' }} md={{ maxWidth: '100%'}}>
                   <Grid container spacing={4}>
                       <Grid item md={12} xs={12} className="paddingTopNone">
                           {/* --- Service Name --- */}
                           <Typography className="paddingLevel" component="h7" variant="h7" >Service Name</Typography>
                       </Grid>
                       <Grid item md={12} xs={12}>
                            <TextField size="small" disabled fullWidth id="serviceName" label="Service Name" name='serviceName'
                                       value={serviceName} className="disableColor"/>
                       </Grid>
                        {/* --- Select A Category --- */}
                       <Grid item md={12} xs={12} className="paddingTopNone">
                           <Typography className="paddingLevel" component="h7" variant="h7">1. Select a service to add to your profile </Typography>
                       </Grid>
                       <Grid item md={6} xs={12}>
                         <FormControl fullWidth size="small">
                           <InputLabel id="demo-select-small-label">Select a Category *</InputLabel>
                           <Select labelId="demo-select-small-label" id="demo-select-small" value={selectCategory} label="Select a Category *"
                                   onChange={(event) => {setSelectCategory(event.target.value); handleSubCategory(event.target.value)}}>
                             {categoryList.map((item) =>
                               <MenuItem value={item.id}>{item.levelData}</MenuItem>
                             )}
                           </Select>
                         </FormControl>
                       </Grid>
                     <Grid item md={6} xs={12}>
                       <FormControl fullWidth size="small">
                         <InputLabel id="demo-select-small-label">Select a Sub Category *</InputLabel>
                         <Select labelId="demo-select-small-label" id="demo-select-small" value={selectSubCategory} label="Select a Sub Category *"
                                 onChange={(event) => setSelectSubCategory(event.target.value)}>
                           {subCategoryList.map((item) =>
                             <MenuItem value={item.id}>{item.levelData}</MenuItem>
                           )}
                         </Select>
                       </FormControl>
                     </Grid>
                     {/* --- Select Version --- */}
                     <Grid item md={12} xs={12} className="paddingTopNone">
                       <Typography className="paddingLevel" component="h7" variant="h7">2. Select version for service category </Typography>
                     </Grid>
                     <Grid item md={12} xs={12}>
                       <FormControl fullWidth size="small">
                         <InputLabel id="demo-select-small-label-v">Version *</InputLabel>
                         <Select labelId="demo-select-small-label-v" id="demo-select-small-v" value={selectVersion} label="Version *"
                                 onChange={(event) => setSelectVersion(event.target.value)}>
                           <MenuItem value="1"><em>1</em></MenuItem>
                           <MenuItem value="2"><em>2</em></MenuItem>
                           <MenuItem value="3"><em>3</em></MenuItem>
                           <MenuItem value="4"><em>4</em></MenuItem>
                           <MenuItem value="5"><em>5</em></MenuItem>
                         </Select>
                       </FormControl>
                     </Grid>
                     {/* --- Select A Category --- */}
                     <Grid item md={12} xs={12} className="paddingTopNone" style={{paddingBottom: '10px'}}>
                       <Typography className="paddingLevel" component="h7" variant="h7">
                         3. Outline the steps for clients to complete the selected service: </Typography>
                     </Grid>
                   </Grid>

                    <Stepper orientation="vertical">
                      {steps.map((step, key) => (
                        <Step active expanded>

                            {/*<StepLabel>Step {key + 1}: {step.labelName}</StepLabel>*/}
                            {/*:*/}
                            <StepLabel style={{position: 'relative'}}>
                              <span>Step {key + 1}: </span>
                              <TextField onChange={(e)=>handleOnChange(e, step, 'labelName')} value={step.labelName}
                                         id="standard-basic" variant="standard" style={{margin: activeStep > key?'-5px 0px 0 5px':'0px 0px 0 5px'}}/>
                              {activeStep > key? null:<CloseIcon style={{padding: '3px', position: 'relative', cursor: 'pointer', top: '5px', left: '5px'}}
                                                                 onClick={()=>handleRemoveSteps(key)}/>}
                            </StepLabel>
                          {/*}*/}
                          <StepContent>
                            <TextField onClick={() => handleClickOpen(key, step)} className="stepsDesign"  id="filled-hidden-label-small"
                                       variant="filled" required fullWidth value={step.labelDetails === ''? 'Click here to add text *':'Click here for view/update text *'}
                              // onChange={(e)=>handleOnChange(e, step, 'labelDetails')}
                            />
                          </StepContent>
                        </Step>
                      ))}
                      <Step active expanded>
                        <StepLabel>
                          <Button onClick={(e)=>handleAddSteps(e)} variant="outlined" startIcon={<AddIcon />}>
                            Add a Step
                          </Button>
                        </StepLabel>
                      </Step>
                    </Stepper>
                   {/* --- Submit Button --- */}
                   {update?
                     <Button onClick={(e)=>myServiceUpdate(e)} type="submit"
                             fullWidth variant="contained" sx={{mt: 3, mb: 2}}>Update service</Button>
                     :
                     <Button onClick={(e)=>myServiceSave(e)} type="submit"
                             fullWidth variant="contained" sx={{mt: 3, mb: 2}}>Add a service</Button>
                   }
                 </Box>
              </CardContent>
            </Card>
        </Grid>
        <Grid item md={7} xs={12}>
          <Card style={{marginTop: '10px', height: '100%'}}>
            <div style={{borderBottom: '1px solid #ccc'}}>
              <CardHeader title='View My Service' titleTypographyProps={{variant: 'h6'}}
                          style={{boarderBottom: '1px solid #ccc'}}/>
            </div>
            <CardContent>
              <ViewServices step={steps} handleEditData={handleEditData}/>
            </CardContent>
          </Card>
        </Grid>
    </Grid>
  );
}
