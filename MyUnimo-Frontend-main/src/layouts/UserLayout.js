// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import VerticalNavItemsImmigrant from 'src/navigation/immigrantMenu'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

// Auth Check
import withAuth from '../auth/WithAuth';

import {useContext, useEffect, useState} from "react";
import {getSingleData} from "../api/FetchData";

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const [userType, setUserType] = useState('')

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const getUserInfo = async (accessToken) =>{
    return await getSingleData('user/getUserDetails', '', accessToken);
  }
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    getUserInfo(accessToken).then((data)=>{
      setUserType(data.userType)
    })
  }, []);

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={userType === 'Immigrant'?VerticalNavItemsImmigrant():userType === 'Professional'?VerticalNavItems():null} // Navigation Items
      verticalAppBarContent={(props) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default withAuth(UserLayout);
