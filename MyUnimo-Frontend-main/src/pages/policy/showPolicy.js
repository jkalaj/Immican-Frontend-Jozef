import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {getData} from "../../api/FetchData";
import DOMPurify from "dompurify";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const ShowPolicy = (props) => {
  const [policyDetails, setPolicyDetails] = useState('')
  const [loader, setLoader] = useState(true)
  const getPolicyByType = async (policyTypeId) =>{
    setLoader(true)
    const options = {policyTypeId: policyTypeId}
    return await getData('settings/getPolicyByType', options);
  }

  useEffect(() => {
    getPolicyByType(props.lookUpId).then((data)=>{
      setPolicyDetails(data.data.policyDetails)
      setLoader(false)
    })
  }, [props]);
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        {loader ?
          <Box style={{padding: '20px'}} sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box> :
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(policyDetails)}}/>
        }
      </Grid>
    </Grid>
  );
};

export default ShowPolicy;
