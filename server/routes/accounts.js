const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { InstagramAccount, Post, Analytics, sequelize } = require('../models');
const { authenticateToken, requireManager } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation middleware
const validateAccount = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 30 })
    .withMessage('Username must be between 1 and 30 characters')
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('Username can only contain letters, numbers, dots, and underscores'),
  body('displayName')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Display name must not exceed 150 characters'),
  body('bio')
    .optional()
    .isLength({ max: 2200 })
    .withMessage('Bio must not exceed 2200 characters'),
];

// Get all accounts with pagination, filtering, and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      isActive,
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      tags
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }
    
    // Search in username, displayName, and bio
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { displayName: { [Op.like]: `%${search}%` } },
        { bio: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }
    
    // Filter by verified status
    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified === 'true';
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      whereClause.tags = {
        [Op.overlap]: tagArray
      };
    }

    const { count, rows: accounts } = await InstagramAccount.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: ['id', 'status'],
          separate: true,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    // Get summary statistics
    const stats = await InstagramAccount.findAll({
      where: req.user.role !== 'admin' ? { userId: req.user.id } : {},
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAccounts'],
        [sequelize.fn('SUM', sequelize.col('followersCount')), 'totalFollowers'],
        [sequelize.fn('SUM', sequelize.col('followingCount')), 'totalFollowing'],
        [sequelize.fn('SUM', sequelize.col('postsCount')), 'totalPosts'],
      ],
      raw: true
    });

    res.json({
      success: true,
      data: {
        accounts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        },
        stats: stats[0] || {
          totalAccounts: 0,
          totalFollowers: 0,
          totalFollowing: 0,
          totalPosts: 0
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accounts'
    });
  }
});

// Get single account by ID
router.get('/:id', async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const account = await InstagramAccount.findOne({
      where: whereClause,
      include: [
        {
          model: Post,
          as: 'posts',
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Analytics,
          as: 'analytics',
          limit: 30,
          order: [['date', 'DESC']]
        }
      ]
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });

  } catch (error) {
    logger.error('Error fetching account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch account'
    });
  }
});

// Create new account
router.post('/', validateAccount, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const accountData = {
      ...req.body,
      userId: req.user.id
    };

    const account = await InstagramAccount.create(accountData);

    logger.info(`New Instagram account created: ${account.username}`, {
      accountId: account.id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account
    });

  } catch (error) {
    logger.error('Error creating account:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create account'
    });
  }
});

// Update account
router.put('/:id', validateAccount, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const whereClause = { id: req.params.id };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const [updatedRows] = await InstagramAccount.update(req.body, {
      where: whereClause
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or no changes made'
      });
    }

    const updatedAccount = await InstagramAccount.findOne({
      where: whereClause
    });

    logger.info(`Instagram account updated: ${updatedAccount.username}`, {
      accountId: updatedAccount.id,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Account updated successfully',
      data: updatedAccount
    });

  } catch (error) {
    logger.error('Error updating account:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update account'
    });
  }
});

// Delete account
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const account = await InstagramAccount.findOne({ where: whereClause });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    await account.destroy();

    logger.info(`Instagram account deleted: ${account.username}`, {
      accountId: account.id,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

// Bulk update accounts
router.patch('/bulk-update', requireManager, async (req, res) => {
  try {
    const { accountIds, updates } = req.body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Account IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    const whereClause = { id: { [Op.in]: accountIds } };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const [updatedRows] = await InstagramAccount.update(updates, {
      where: whereClause
    });

    logger.info(`Bulk update performed on ${updatedRows} accounts`, {
      accountIds,
      updates,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: `Successfully updated ${updatedRows} accounts`,
      data: { updatedCount: updatedRows }
    });

  } catch (error) {
    logger.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk update'
    });
  }
});

// Sync account data (placeholder for actual Instagram API integration)
router.post('/:id/sync', async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const account = await InstagramAccount.findOne({ where: whereClause });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // TODO: Implement actual Instagram API sync
    // For now, just update the lastSyncAt timestamp
    await account.update({ lastSyncAt: new Date() });

    logger.info(`Account sync initiated: ${account.username}`, {
      accountId: account.id,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Account sync completed',
      data: { lastSyncAt: account.lastSyncAt }
    });

  } catch (error) {
    logger.error('Error syncing account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync account'
    });
  }
});

module.exports = router;