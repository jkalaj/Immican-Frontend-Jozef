import React, {useEffect} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ErrorIcon from "@mui/icons-material/Error";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Calendar from 'react-calendar';
import DoneIcon from '@mui/icons-material/Done';
import 'react-calendar/dist/Calendar.css';
import DOMPurify from "dompurify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
const Modal = (props) => {
  const [open, setOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [discoverCall, onChange] = React.useState(new Date());

  useEffect(() => {
    setOpen(props.open)
  }, [open]);
  return (
    <BootstrapDialog onClose={()=>props.handleClose()} aria-labelledby="customized-dialog-title" open={open}>
      {calendarOpen?
        <>
          <DialogContent dividers>
            <Typography gutterBottom>
              <Calendar onChange={onChange} value={discoverCall} />
            </Typography>
            <DialogActions style={{margin: '0 auto'}}>
              <Button autoFocus onClick={()=>{props.handleCalendarDate(discoverCall); props.handleClose()}}>Book Discovery Call</Button>
            </DialogActions>
          </DialogContent>
        </>
        :
        <>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">{props.title}</DialogTitle>
          <IconButton aria-label="close" onClick={()=>props.handleClose()} sx={{position: 'absolute', right: 8,
            top: 8, color: (theme) => theme.palette.grey[500],}}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              <Grid container spacing={4} style={{padding: '10px'}}>
                <Grid item md={1} xs={1}>
                  <ErrorIcon color="info" />
                </Grid>
                <Grid item md={11} xs={11}>
                  <Typography className="titleDesign" component="h5" variant="h5">
                    <div className="descriptionDesign" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.popUpMessage)}}/>
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </DialogContent>
          {!props.needButton?
            <DialogActions>
              <Button autoFocus onClick={()=>props.handleClose()}>Close</Button>
            </DialogActions>:
            props.title === 'Book a Discovery Call'?
              <DialogActions style={{margin: '0 auto'}}>
                <Button autoFocus onClick={()=>{setCalendarOpen(true)}}>{props.title}</Button>
              </DialogActions>:
              <DialogActions style={{margin: '0 auto', padding:'12px'}}>
                <Button variant="contained" color="success" onClick={()=>{props.handleAcceptRequest('Accepted')}}><DoneIcon />Accept</Button>
                <Button variant="contained" color="error" onClick={()=>{props.handleAcceptRequest('Decline')}}><CloseIcon />Decline</Button>
              </DialogActions>
          }
        </>
      }
    </BootstrapDialog>
  );
};

export default Modal;
