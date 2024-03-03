import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { IconListCheck, IconMail, IconUser, IconShoppingCart, IconCoin, IconMan } from '@tabler/icons';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { useTheme } from '@emotion/react';


const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const theme = useTheme();
  const findingUser = localStorage.getItem("user");
  const userCounting = localStorage.getItem(`${findingUser}_counting`)

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        {/* <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        /> */}
        <IconUser color={theme.palette.secondary.main}/>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconCoin width={20} />
          </ListItemIcon>
          <ListItemText>Remaining : {userCounting}</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconShoppingCart width={20}/>
          </ListItemIcon>
          <ListItemText>Go To Shop</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button to="/" variant="outlined" color="secondary" component={Link} fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
