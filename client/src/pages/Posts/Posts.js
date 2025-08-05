import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Posts = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Posts Management
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Content Creation & Scheduling
          </Typography>
          <Typography color="textSecondary">
            Create, edit, and schedule posts across all your Instagram accounts. 
            Manage post content, upload media, schedule publishing times, 
            and track post performance.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Posts;