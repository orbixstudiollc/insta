import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountBox,
  People,
  PhotoLibrary,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { analyticsAPI, postsAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

// Stats Card Component
const StatsCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value?.toLocaleString() || '0'}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Recent Posts Table Component
const RecentPostsTable = ({ posts = [] }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Account</TableCell>
          <TableCell>Caption</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {posts.slice(0, 5).map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <Typography variant="body2" fontWeight="bold">
                @{post.account?.username}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2" sx={{ maxWidth: 200 }}>
                {post.caption ? 
                  (post.caption.length > 50 ? 
                    `${post.caption.substring(0, 50)}...` : 
                    post.caption
                  ) : 
                  'No caption'
                }
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                label={post.status}
                size="small"
                color={
                  post.status === 'published' ? 'success' :
                  post.status === 'scheduled' ? 'primary' :
                  post.status === 'draft' ? 'default' : 'error'
                }
              />
            </TableCell>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Typography>
            </TableCell>
            <TableCell>
              <Tooltip title="View">
                <IconButton size="small">
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Dashboard = () => {
  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    'dashboard',
    analyticsAPI.getDashboard
  );

  // Fetch recent posts
  const { data: postsData, isLoading: postsLoading } = useQuery(
    'recentPosts',
    () => postsAPI.getPosts({ limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' })
  );

  const stats = dashboardData?.data?.data || {};
  const posts = postsData?.data?.data?.posts || [];

  if (dashboardLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Accounts"
            value={stats.accountStats?.totalAccounts}
            icon={<AccountBox color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Followers"
            value={stats.accountStats?.totalFollowers}
            icon={<People color="secondary" />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Posts"
            value={stats.postStats?.totalPosts}
            icon={<PhotoLibrary color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Likes"
            value={stats.postStats?.totalLikes}
            icon={<TrendingUp color="warning" />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Posts
              </Typography>
              {postsLoading ? (
                <Typography>Loading posts...</Typography>
              ) : posts.length > 0 ? (
                <RecentPostsTable posts={posts} />
              ) : (
                <Typography color="textSecondary">
                  No posts found. Create your first post to get started!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;