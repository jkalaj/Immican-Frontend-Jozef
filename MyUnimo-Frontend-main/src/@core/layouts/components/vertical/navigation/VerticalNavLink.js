// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
// Configs Import
import themeConfig from 'src/configs/ThemeConfig'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import {useState} from "react";
import VerticalNavSubMenu from "./VerticalNavSubmenu";

// ** Styled Components
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }) => {
  // ** Hooks
  const router = useRouter()
  const IconTag = item.icon
  const [isSubOptionsOpen, setIsSubOptionsOpen] = useState(false)

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <ListItem disablePadding className='nav-link' disabled={item.disabled || false} sx={{ mt: 1.5, px: '0 !important' }}>
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink component={'a'} className={isNavLinkActive() ? 'active' : ''}
                       {...(item.openInNewTab ? { target: '_blank' } : null)}
                       onClick={e => {
                         if (item.path === undefined) {
                           e.preventDefault()
                           e.stopPropagation()
                         }
                         if(item.children === undefined){
                           if (navVisible) {
                             toggleNavVisibility()
                           }}
                         if(item.children !== undefined){
                           if (item.children.length !== 0) {
                             setIsSubOptionsOpen(!isSubOptionsOpen)
                           }
                         }


                       }}
                       sx={{
                         pl: 5.5,
                         ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                       }}
          >
            <ListItemIcon sx={{mr: 2.5, color: 'text.primary', transition: 'margin .25s ease-in-out'}}>
              <UserIcon icon={IconTag} />
            </ListItemIcon>

            <MenuItemTextMetaWrapper>
              <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
              {item.children !== undefined?
                isSubOptionsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                :null
              }
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>
      {isSubOptionsOpen && <VerticalNavSubMenu subMenu={item.children} toggleNavVisibility={toggleNavVisibility} navVisible={navVisible}/>}
    </>
  )
}

export default VerticalNavLink
