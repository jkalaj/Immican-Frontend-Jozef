import React, {useEffect} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {getSingleData} from "../../../../api/FetchData";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
const EmployeeList = (props) => {
  const [open, setOpen] = React.useState(false);
  const [employeeList, setEmployeeList] = React.useState([]);
  const [name, setName] = React.useState('');
  const getEmployeeData = async () =>{
    let userToken = localStorage.getItem("access_token")
    return await getSingleData('user/getEmployeeDetails', '', userToken);
  }
  const handleChange = (e, row) =>{
    if(e.target.checked){
      setName(row.firstName + ' ' + row.lastName)
    } else {
      setName('')
    }
  }
  useEffect(() => {
    setOpen(props.open)
    getEmployeeData().then((data)=>{
      // console.log(data)
      setEmployeeList(data)
    })
  }, [open]);
  return (
    <Dialog onClose={()=>props.handleClose()} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Select Calendar User</DialogTitle>
      <IconButton aria-label="close" onClick={()=>props.handleClose()} sx={{position: 'absolute', right: 8,
        top: 8, color: (theme) => theme.palette.grey[500],}}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          <Grid container spacing={4} style={{padding: '10px'}}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow sx={{'&:last-child td, &:last-child th': { border: 1 }}}>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Select User</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeList.map((row) => (
                    <TableRow key={row.serviceName} sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                      <TableCell style={{border: '1px solid'}} component="th" scope="row">{row.firstName} {row.lastName}</TableCell>
                      <TableCell style={{border: '1px solid', padding: '0px'}}>
                        {row.profileAllow?
                          <p className="requestTypeDesign colorPlatteAccept">Available</p> :
                          <p className="requestTypeDesign colorPlattePadding">Not Available</p>
                        }
                      </TableCell>
                      <TableCell style={{padding: '0', border: '1px solid'}}>
                        <Checkbox{...label} sx={{'& .MuiSvgIcon-root': {fontSize: 28}}} disabled={!row.profileAllow}
                                 onChange={(e)=>handleChange(e, row)}/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={()=>{props.saveButton(name);props.handleClose()}}>Save</Button>
        <Button autoFocus onClick={()=>props.handleClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeList;
