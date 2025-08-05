import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Reports
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Insights
          </Typography>
          <Typography color="textSecondary">
            Track performance metrics across all your Instagram accounts. 
            View engagement rates, follower growth, post performance, 
            and generate comprehensive reports for data-driven decisions.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;