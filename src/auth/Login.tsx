import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Login: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Login</Typography>
      <Button variant="contained">Login</Button>
    </Box>
  );
};

export const LogoutButton: React.FC = () => {
  return (
    <Button variant="outlined" color="secondary">
      Logout
    </Button>
  );
};

export default Login;
