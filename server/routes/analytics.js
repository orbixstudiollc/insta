const express = require('express');
const { Analytics, InstagramAccount, Post, sequelize } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authenticateToken);

// Get analytics for a specific account
router.get('/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { days = 30 } = req.query;

    // Verify account access
    const account = await InstagramAccount.findOne({
      where: {
        id: accountId,
        ...(req.user.role !== 'admin' && { userId: req.user.id })
      }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or access denied'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await Analytics.findAll({
      where: {
        accountId,
        date: { [Op.gte]: startDate }
      },
      order: [['date', 'ASC']]
    });

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const whereClause = req.user.role !== 'admin' ? { userId: req.user.id } : {};

    // Get account stats
    const accountStats = await InstagramAccount.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAccounts'],
        [sequelize.fn('SUM', sequelize.col('followersCount')), 'totalFollowers'],
        [sequelize.fn('SUM', sequelize.col('followingCount')), 'totalFollowing'],
        [sequelize.fn('SUM', sequelize.col('postsCount')), 'totalPosts'],
      ],
      raw: true
    });

    // Get post stats
    const postStats = await Post.findAll({
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: whereClause,
        attributes: []
      }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Post.id')), 'totalPosts'],
        [sequelize.fn('SUM', sequelize.col('likesCount')), 'totalLikes'],
        [sequelize.fn('SUM', sequelize.col('commentsCount')), 'totalComments'],
      ],
      raw: true
    });

    // Get recent activity
    const recentPosts = await Post.findAll({
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: whereClause,
        attributes: ['id', 'username', 'displayName']
      }],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        accountStats: accountStats[0] || {
          totalAccounts: 0,
          totalFollowers: 0,
          totalFollowing: 0,
          totalPosts: 0
        },
        postStats: postStats[0] || {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0
        },
        recentPosts
      }
    });

  } catch (error) {
    logger.error('Error fetching dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;