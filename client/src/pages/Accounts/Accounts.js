import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Accounts = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Instagram Accounts
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Management
          </Typography>
          <Typography color="textSecondary">
            This page will allow you to manage all your Instagram accounts. 
            Features include adding new accounts, editing account details, 
            bulk operations, and syncing account data.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Accounts;