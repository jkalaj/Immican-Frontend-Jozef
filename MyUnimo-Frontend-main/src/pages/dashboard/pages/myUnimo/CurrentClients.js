import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Link, Button } from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Chat } from 'mdi-material-ui';
import Modal from '../../../../@core/utils/modal';
import DescriptionAlerts from "../../../../@core/utils/alert";
import {getSingleData, postData} from "../../../../api/FetchData";



const CurrentClients = (props) => {
  const [myUnimoClientList, setMyUnimoClientList] = useState([]);
  const [open, setOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [changedIndices, setChangedIndices] = useState([]);
  const [title, setTitle] = useState('');
  const [needButton, setNeedButton] = useState(false);

  const handleClickOpen = (status, labelDetails) => {
    setPopUpMessage(labelDetails)
    setNeedButton(false)
    setTitle('MyClient Notes')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeStatus = (index, newStatus) => {
    const updatedList = [...myUnimoClientList];
    updatedList[index].currentClientStatus = newStatus;
    setMyUnimoClientList(updatedList);

    // Add the index to the changedIndices array
    if (!changedIndices.includes(index)) {
      setChangedIndices([...changedIndices, index]);
    }
  };

  const getMyUnimoClientData = async () =>{
    let userToken = localStorage.getItem("access_token")
    const options = {type: 'currentClient'}
    return await getSingleData('myunimo/getMyUnimoClient', options, userToken);
  }



  const updateMyUnimoDetails = async (e, id, currentClientStatus, stepNo, serviceId) => {
    e.preventDefault();
    const options = { id: id, currentClientStatus: currentClientStatus, stepNo:stepNo, serviceId: serviceId };
    const data = await postData('myunimo/updateMyUnimo', options);
    if (data.status === 'success') {
      setOpenAlert(true);
      setErrorMessage(data.message);
      setAlertType('success');
      getMyUnimoClientData().then((data)=>{setMyUnimoClientList(data)});
      setChangedIndices([]); // Clear the changedIndices array after updating
    } else if (data.status === 'failed') {
      setOpenAlert(true);
      setErrorMessage(data.message);
      setAlertType('error');
    }
  };

  useEffect(() => {
    getMyUnimoClientData().then((data)=>{setMyUnimoClientList(data)})
  }, []);

  return (
    <Card>
      <CardContent>
      {openAlert? <DescriptionAlerts alertType={alertType} message={errorMessage} setOpenAlert={setOpenAlert}/> :null}
        {open ?
          <Modal handleClose={handleClose} open={open} title={title}
                 popUpMessage={popUpMessage} needButton={needButton}/>  : null
        }
        <Typography variant="h6" gutterBottom style={{ borderBottom: '5px solid #ccc', paddingBottom: '15px' }}>
          View List of Current Clients
        </Typography>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                <TableCell>MyUnimo#</TableCell>
                <TableCell>Service Category</TableCell>
                <TableCell>Current Step</TableCell>
                <TableCell>Client Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Employee</TableCell>
                <TableCell>Client Portal</TableCell>
                <TableCell>Save Changes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myUnimoClientList.map((row, index) => (
                <TableRow key={row.myUnimoNo} sx={{ '&:last-child td, &:last-child th': { border: 0.5 } }}>
                  <TableCell style={{ border: '1px solid' }} component="th" scope="row">{row.myUnimoNo}</TableCell>
                  <TableCell style={{ border: '1px solid' }}>{row.serviceName}</TableCell>
                  <TableCell style={{ textAlign: 'left', border: '1px solid' }}>
                    <Grid container spacing={4}>
                      <Grid item md={10} xs={10}>
                        <p> Step {row.stepNo}</p>
                      </Grid>
                      <Grid item md={2} xs={2} style={{padding: '29px 3px 0px'}}>
                        <p style={{margin: '0px'}} className="arrowBorder">
                          <KeyboardDoubleArrowDownIcon style={{width: '100%', color: 'blue'}} onClick={()=>handleClickOpen(row.stepNo, row.labelDetails)}/></p>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell style={{ border: '1px solid' }}>{row.clientEmail}</TableCell>
                  <TableCell style={{ border: '1px solid' }}>
                      <Select value={row.currentClientStatus}  style={{ width: '100%', height: '40px' }}
                              onChange={(e) => handleChangeStatus(index, e.target.value)}
                              sx={{ color: row.currentClientStatus === 'Accepted' ? 'green' : row.currentClientStatus === 'Decline' ? 'red' : 'orange' }}>
                        <MenuItem value="Accepted" style={{ color: 'green' }}>Accepted</MenuItem>
                        <MenuItem value="Decline" style={{ color: 'red' }}>Decline</MenuItem>
                      </Select>
                  </TableCell>

                  <TableCell style={{ textAlign: 'left', border: '1px solid' }}>
                    <Grid container spacing={4}>
                      <Grid item md={10} xs={10}>
                        <p> {row.employeeName}</p>
                      </Grid>
                      <Grid item md={2} xs={2} style={{padding: '29px 3px 0px'}}>
                        <p style={{margin: '0px'}} className="arrowBorder">
                          <Chat style={{ width: '100%', color: 'blue' }} /></p>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell style={{ border: '1px solid' }}>
                    <Link href={row.clientPortalLink} target="_blank" rel="noopener noreferrer">
                      {row.clientPortalLink}
                    </Link>
                  </TableCell>
                  <TableCell style={{ border: '1px solid' }}>
                  <Button variant="contained" color="primary" sx={{ color: 'white' }} onClick={(e) => updateMyUnimoDetails(e, row.id, row.currentClientStatus, row.stepNo, row.serviceId)}>
                    Update
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default CurrentClients;
