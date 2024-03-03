import React from 'react';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';

// components
import PageContainer from 'src/components/container/PageContainer';
import dataNomadsTrans from 'src/assets/images/logos/dataNomadsTrans.png'
import dataNomadsLogo from 'src/assets/images/logos/dataNomadsLogo.png';
import dataNomadsDark from 'src/assets/images/logos/darkNomadsTrans.png';
import dataNomadsLight from 'src/assets/images/logos/lightNomadsTrans.png';

import AuthLogin from './auth/AuthLogin';

const Login2 = () => {
  
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* <Logo /> */}
                <img 
                  width={'250px'}
                  src={dataNomadsLight} 
                  alt={dataNomadsLight}
                />
              </Box>
              <AuthLogin
                // subtext={
                //   <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                //     Enter your ID and Password
                //   </Typography>
                // }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;
