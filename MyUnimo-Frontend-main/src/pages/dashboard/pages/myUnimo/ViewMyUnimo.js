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
import Modal from "../../../../@core/utils/modal";
import moment from "moment";
import CustomModal from "../../../../@core/utils/customModal";


const ViewMyUnimo = (props) => {
  const [savedMyUnimo, setSavedMyUnimo] = useState(false)
  const [myUnimoClientList, setMyUnimoClientList] = useState([])
  const [open, setOpen] = React.useState(false);
  const [popUpMessage, setPopUpMessage] = React.useState('');

  const handleClickOpen = (status) => {
    setOpen(true);
    if(status === '! Pending'){
      setPopUpMessage('An invitation has been sent and is pending the client’s approval.')
    } else if(status === 'Accepted'){
       setPopUpMessage('Your service request has been Accepted.')
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getMyUnimoClientData = async () =>{
    let userToken = localStorage.getItem("access_token")
    const options = {type: 'ViewDetails'}
    return await getSingleData('myunimo/getMyUnimoClient', options, userToken);
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
        <CustomModal handleClose={handleClose} open={open} title={'My Unimo Details'}
               popUpMessage={popUpMessage} needButton={false} />:null
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
                    <TableCell>Client Email</TableCell>
                    <TableCell>Request Status</TableCell>
                    <TableCell>Customer Status</TableCell>
                    <TableCell>Discover Call Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myUnimoClientList.map((row) => (
                    <TableRow key={row.serviceName} sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                      <TableCell style={{border: '1px solid'}} component="th" scope="row">{row.serviceName}</TableCell>
                      <TableCell style={{border: '1px solid'}} >{row.clientEmail}</TableCell>
                      <TableCell style={{padding: '0', border: '1px solid'}}>
                        <Grid container spacing={4}>
                          <Grid item md={10} xs={10}>
                            <p className={row.requestStatus === 'Accepted'? "requestTypeDesign colorPlatteAccept":"requestTypeDesign colorPlattePadding"}>
                              {row.requestStatus}</p>
                          </Grid>
                          <Grid item md={2} xs={2} style={{padding: '29px 3px 0px'}}>
                             <p style={{margin: '0px'}} className="arrowBorder">
                               <KeyboardDoubleArrowDownIcon style={{width: '100%', color: 'blue'}} onClick={()=>handleClickOpen(row.requestStatus)}/></p>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell style={{border: '1px solid'}}>
                        <p className={row.customerStatus === 'Accepted'?"customerStatusDesign colorPlatteAccept" :"customerStatusDesign colorPlattePadding"}
                             style={{margin: '0', fontSize: '14px'}}>{row.customerStatus}</p></TableCell>
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
