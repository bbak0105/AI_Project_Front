import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, AppBar, Toolbar, styled, Menu, Stack, IconButton, Badge, Button, MenuItem, ListItemIcon } from '@mui/material';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconBellRinging, IconListCheck, IconMenu } from '@tabler/icons';

const Header = (props) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        
        <Box flexGrow={1}>
        {/* 알림 설정 아이콘 */}
        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            color: 'secondary.main',
          }}
          onClick={(e) => console.log(e)}
        >
            <Badge variant="dot" color="secondary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
        </Box>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
