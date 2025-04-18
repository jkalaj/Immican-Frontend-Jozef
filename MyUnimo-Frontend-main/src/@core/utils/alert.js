import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect} from "react";

export default function DescriptionAlerts(props) {
    const [open, setOpen] = React.useState(true);
    useEffect(() => {
        setTimeout(() => {setOpen(false); props.setOpenAlert(false)}, 5000);
    }, [props.setOpenAlert]);

    return (
        <Box sx={{ width: '100%', marginTop: '65px', zIndex: '9999' }} className='alertBox'>
            <Collapse in={open}>
                <Alert action={
                        <IconButton aria-label="close" color="inherit" size="small"
                            onClick={() => {setOpen(false); props.setOpenAlert(false)}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    } sx={{ mb: 2 }} severity={props.alertType}>
                    <AlertTitle style={{textTransform: 'capitalize'}}>{props.alertType}</AlertTitle>
                    {props.message}
                </Alert>
            </Collapse>
        </Box>
    );
}
