import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import ErrorIcon from "@mui/icons-material/Error";
import {getSingleData} from "../../../../api/FetchData";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import CustomModal from "../../../../@core/utils/customModal";


const ViewMyUnimo = (props) => {
  const [savedMyUnimo, setSavedMyUnimo] = useState(false)
  const [myUnimoClientList, setMyUnimoClientList] = useState([])
  const [open, setOpen] = React.useState(false);
  const [needButton, setNeedButton] = React.useState(false);
  const [popUpMessage, setPopUpMessage] = React.useState('');
  const [myUnimoId, setMyUnimoId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [serviceId, setServiceId] = React.useState('');

  const handleClickOpen = (status, id, serviceId, meetingLink) => {
    setOpen(true);
    setServiceId(serviceId);
    if(status === 'Requested'){
      setPopUpMessage('To begin, please select a date to meet with the business to discuss the service details.')
      setNeedButton(true)
      setTitle('Book a Discovery Call')
      setMyUnimoId(id)
    } else if(status === 'Pending'){
      setPopUpMessage('Would you like to accept the request or decline the service request?')
      setTitle('MyUnimo Details')
      setNeedButton(true)
      setMyUnimoId(id)
    } else if(status === 'Accepted'){
      setPopUpMessage('You have Accepted the service request. Discovery call Meeting Link ~ '+meetingLink)
      setTitle('MyUnimo Details')
      setNeedButton(false)
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCalendarDate = (date) =>{
    let newList = [...myUnimoClientList]
    newList.map((data)=>{
      console.log('data', data)
      if(data.id === myUnimoId){
        data['discoverCallDate'] = moment(date).format('YYYY/MM/DD')
        data['customerStatus'] = 'Pending'
      }
    })
    updateDiscoveryDetailsData(moment(date).format('YYYY/MM/DD')).then((data)=>console.log(data))
  }

  const handleAcceptRequest = (type) =>{
    console.log(type)
    updateCurrentStateData(type).then((data)=>console.log(data))
    if(type === 'Accepted') {
      props.setTabValue('CurrentClients')
    }
  }

  const updateCurrentStateData = async (type) =>{
    console.log('myUnimoId', myUnimoId)
    let userToken = localStorage.getItem("access_token")
    const options = {id: myUnimoId, customerStatus: type, requestStatus: type, serviceId: serviceId}
    return await getSingleData('myunimo/updateCurrentStateData', options, userToken);
  }

  const updateDiscoveryDetailsData = async (date) =>{
    let userToken = localStorage.getItem("access_token")
    const options = {discoveryDate: date, id: myUnimoId, customerStatus: 'Pending', requestStatus: '! Pending'}
    return await getSingleData('myunimo/updateDiscoveryDate', options, userToken);
  }

  const getMyUnimoClientData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('myunimo/getMyUnimoDetails', '', userToken);
  }

  useEffect(() => {
    getMyUnimoClientData().then((data)=>{
      // console.log('data',data)
      setMyUnimoClientList(data)
      setSavedMyUnimo(data.length !== 0)
    })
  }, [props]);

  return (
    <Grid container spacing={4} style={{height: '100%'}}>
      {open?
        <CustomModal  handleClose={handleClose} open={open} title={title} handleAcceptRequest={handleAcceptRequest}
                      popUpMessage={popUpMessage} needButton={needButton} handleCalendarDate={handleCalendarDate} /> :null
      }
      {!savedMyUnimo?
        <>
          <Grid item md={3} xs={0}/>
          <Grid item md={6} xs={12} style={{border: '1px solid #ccc', padding: '0px', marginTop: '30px'}}>
            <Grid container spacing={4} style={{padding: '30px'}}>
              <Grid item md={1} xs={1}>
                <ErrorIcon color="info" />
              </Grid>
              <Grid item md={11} xs={11}>
                <Typography className="titleDesign" component="h6" variant="h6">
                  Complete the information in "Add MyUnimo" <br/> and invite clients to take advantage of your <br/> services.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} xs={0}/>
        </>
        :
        <Grid item md={12} xs={12} style={{marginTop: '30px'}}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow sx={{'&:last-child td, &:last-child th': { border: 1 }}}>
                    <TableCell>Service Category</TableCell>
                    <TableCell>Business Email</TableCell>
                    <TableCell>Customer Status</TableCell>
                    <TableCell>Request Status</TableCell>
                    <TableCell>Discover Call Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myUnimoClientList.map((row) => (
                    <TableRow key={row.serviceName} sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                      <TableCell style={{border: '1px solid'}} component="th" scope="row">{row.serviceName}</TableCell>
                      <TableCell style={{border: '1px solid'}} >{row.email}</TableCell>
                      <TableCell style={{padding: '0', border: '1px solid'}}>
                        <Grid container spacing={4}>
                          <Grid item md={10} xs={10}>
                            <p className={row.customerStatus === 'Accepted'? "requestTypeDesign colorPlatteAccept":"requestTypeDesign colorPlattePadding"}>
                              {row.customerStatus}</p>
                          </Grid>
                          <Grid item md={2} xs={2} style={{padding: '29px 3px 0px'}}>
                             <p style={{margin: '0px'}} className="arrowBorder">
                               <KeyboardDoubleArrowDownIcon style={{width: '100%', color: 'blue'}}
                                                            onClick={()=>handleClickOpen(row.customerStatus, row.id, row.serviceId, row.meetingLink)}/></p>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell style={{border: '1px solid'}}>
                        <p className={row.requestStatus === 'Accepted'?"customerStatusDesign colorPlatteAccept" :"customerStatusDesign colorPlattePadding"}
                             style={{margin: '0', fontSize: '14px'}}>{row.requestStatus}</p></TableCell>
                      <TableCell style={{border: '1px solid'}}>{row.discoverCallDate !== null? moment(row.discoverCallDate).format('MMM DD, YYYY'): ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>
      }
    </Grid>
  );
};

export default ViewMyUnimo;
