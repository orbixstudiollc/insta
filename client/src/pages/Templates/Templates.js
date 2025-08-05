import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Templates = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Templates
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reusable Content Library
          </Typography>
          <Typography color="textSecondary">
            Create and manage reusable content templates for consistent posting. 
            Save time by creating templates with predefined captions, hashtags, 
            and media that can be applied across multiple accounts.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Templates;