import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {fetchWithToken, getSingleData} from '../api/FetchData';
import {StateContext} from "../@core/context/stateContext";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const initialValues = {
      firstName:'',
      lastName:'',
      email:'',
      phone:'',
      jobPosition:'',
      about:'',
      companyLegalName:'',
      country:'',
      address:'',
      userType:'',
      profileAllow:'',
    };

    const [values, setValues] = useState(initialValues)

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          await router.replace('/login');
          return;
        }
        try {
          await validateAccessToken(accessToken);
        } catch (error) {
          console.error('Access token validation failed', error);
          await router.replace('/login');
        } finally {
          setLoading(false);
        }
      };
      checkAuth();
    }, []);

    const validateAccessToken = async (accessToken) => {
      try {
        const data = await fetchWithToken('login/validateAccessToken', accessToken, { /* optional params */ });
        // console.log('Data: ==>', data);
        if(data.status === "success"){
          getUserInfo(accessToken).then((data)=>{
            setValues({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              companyLegalName: data.companyLegalName,
              country: data.country === undefined?data.countryResidence: data.country,
              about: data.about,
              address: data.address,
              userType: data.userType,
              jobPosition: data.jobPosition,
              profileAllow: data.profileAllow,
            })
          })
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        await router.replace('/login');
      }
    };

    const getUserInfo = async (accessToken) =>{
      return await getSingleData('user/getUserDetails', '', accessToken);
    }

    return (
      <StateContext.Provider value={{values, setValues}}>
        <Box minHeight="100vh">
          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="h6" gutterBottom>
                Loading, please wait...
              </Typography>
              <CircularProgress />
            </Box>
          ) : (
            <WrappedComponent {...props} />
          )}
        </Box>
      </StateContext.Provider>
    );
  };

  return AuthComponent;
};

export default withAuth;
