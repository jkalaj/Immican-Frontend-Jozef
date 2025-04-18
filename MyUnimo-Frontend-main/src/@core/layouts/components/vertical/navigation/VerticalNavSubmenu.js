// VerticalNavSubmenu.js
import React, {useState} from 'react';
import Link from 'next/link'
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import themeConfig from "../../../../../configs/ThemeConfig";
import {useRouter} from "next/router";
import {handleURLQueries} from "../../../utils";
import UserIcon from "../../../../../layouts/components/UserIcon";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

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

const VerticalNavSubMenu = (props) => {
  const [subMenuList] = useState(props.subMenu)
  const router = useRouter()

  const isNavLinkActive = (path) => {
    return !!(router.pathname === path || handleURLQueries(router, path));
  }

  return (
    <>
      {subMenuList.map((item, key)=>
          <Link key={key} passHref href={item.path === undefined ? '/' : `${item.path}`}>
            <MenuNavLink component={'a'} className={isNavLinkActive(item.path) ? 'active' : ''}
                         {...(item.openInNewTab ? { target: '_blank' } : null)}
                         onClick={e => {
                           if (item.path === undefined) {
                             e.preventDefault()
                             e.stopPropagation()
                           }
                           if (props.navVisible) {
                             props.toggleNavVisibility()
                           }
                         }}
                         sx={{
                           pl: 5.5,
                           ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                         }}
            >

              <ListItemIcon sx={{mr: 2.5, color: 'text.primary', transition: 'margin .25s ease-in-out'}}>
                <UserIcon icon={item.icon} />
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
              </MenuItemTextMetaWrapper>
            </MenuNavLink>
          </Link>
      )}
    </>
  );
};

export default VerticalNavSubMenu;
