const express = require('express');
const { body, validationResult } = require('express-validator');
const { InstagramAccount, Post, ContentTemplate, sequelize } = require('../models');
const { authenticateToken, requireManager } = require('../middleware/auth');
const { createRateLimitMiddleware } = require('../middleware/rateLimit');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication and bulk operation rate limiting
router.use(authenticateToken);
router.use(createRateLimitMiddleware('bulk'));

// Bulk import accounts from CSV/JSON
router.post('/import-accounts', requireManager, [
  body('accounts')
    .isArray({ min: 1 })
    .withMessage('Accounts array is required'),
  body('accounts.*.username')
    .notEmpty()
    .withMessage('Username is required for each account')
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('Username can only contain letters, numbers, dots, and underscores'),
], async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { accounts, skipDuplicates = true } = req.body;
    const results = {
      created: [],
      skipped: [],
      errors: []
    };

    for (const accountData of accounts) {
      try {
        // Check if account already exists
        const existingAccount = await InstagramAccount.findOne({
          where: { username: accountData.username },
          transaction
        });

        if (existingAccount) {
          if (skipDuplicates) {
            results.skipped.push({
              username: accountData.username,
              reason: 'Already exists'
            });
            continue;
          } else {
            results.errors.push({
              username: accountData.username,
              reason: 'Username already exists'
            });
            continue;
          }
        }

        // Create account
        const account = await InstagramAccount.create({
          ...accountData,
          userId: req.user.id
        }, { transaction });

        results.created.push({
          id: account.id,
          username: account.username
        });

      } catch (error) {
        results.errors.push({
          username: accountData.username,
          reason: error.message
        });
      }
    }

    await transaction.commit();

    logger.info(`Bulk import completed: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors`, {
      userId: req.user.id,
      results
    });

    res.json({
      success: true,
      message: `Import completed: ${results.created.length} accounts created`,
      data: results
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import accounts'
    });
  }
});

// Bulk update accounts
router.patch('/update-accounts', requireManager, [
  body('accountIds')
    .isArray({ min: 1 })
    .withMessage('Account IDs array is required'),
  body('updates')
    .isObject()
    .withMessage('Updates object is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { accountIds, updates } = req.body;

    // Validate accountIds limit
    if (accountIds.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update more than 100 accounts at once'
      });
    }

    const whereClause = { 
      id: { [Op.in]: accountIds }
    };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const [updatedCount] = await InstagramAccount.update(updates, {
      where: whereClause
    });

    logger.info(`Bulk update completed: ${updatedCount} accounts updated`, {
      userId: req.user.id,
      accountIds,
      updates
    });

    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} accounts`,
      data: { updatedCount }
    });

  } catch (error) {
    logger.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update accounts'
    });
  }
});

// Bulk delete accounts
router.delete('/delete-accounts', requireManager, [
  body('accountIds')
    .isArray({ min: 1 })
    .withMessage('Account IDs array is required'),
], async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { accountIds } = req.body;

    // Validate accountIds limit
    if (accountIds.length > 50) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete more than 50 accounts at once'
      });
    }

    const whereClause = { 
      id: { [Op.in]: accountIds }
    };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    // Get accounts to be deleted for logging
    const accountsToDelete = await InstagramAccount.findAll({
      where: whereClause,
      attributes: ['id', 'username'],
      transaction
    });

    // Delete accounts (this will cascade to related posts and analytics)
    const deletedCount = await InstagramAccount.destroy({
      where: whereClause,
      transaction
    });

    await transaction.commit();

    logger.info(`Bulk delete completed: ${deletedCount} accounts deleted`, {
      userId: req.user.id,
      deletedAccounts: accountsToDelete.map(acc => ({ id: acc.id, username: acc.username }))
    });

    res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} accounts`,
      data: { deletedCount }
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accounts'
    });
  }
});

// Bulk post creation across multiple accounts
router.post('/create-posts', requireManager, [
  body('accountIds')
    .isArray({ min: 1 })
    .withMessage('Account IDs array is required'),
  body('postData')
    .isObject()
    .withMessage('Post data is required'),
  body('postData.caption')
    .optional()
    .isString(),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
], async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { accountIds, postData, scheduledAt } = req.body;

    // Validate accountIds limit
    if (accountIds.length > 50) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot create posts for more than 50 accounts at once'
      });
    }

    const whereClause = { 
      id: { [Op.in]: accountIds },
      isActive: true
    };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    // Verify accounts exist and belong to user
    const accounts = await InstagramAccount.findAll({
      where: whereClause,
      attributes: ['id', 'username'],
      transaction
    });

    if (accounts.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'No valid accounts found'
      });
    }

    // Create posts for each account
    const posts = [];
    for (const account of accounts) {
      const post = await Post.create({
        ...postData,
        accountId: account.id,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }, { transaction });

      posts.push({
        id: post.id,
        accountId: account.id,
        accountUsername: account.username
      });
    }

    await transaction.commit();

    logger.info(`Bulk post creation completed: ${posts.length} posts created`, {
      userId: req.user.id,
      accountIds,
      postData: { ...postData, caption: postData.caption?.substring(0, 100) + '...' }
    });

    res.json({
      success: true,
      message: `Successfully created ${posts.length} posts across ${accounts.length} accounts`,
      data: { posts, createdCount: posts.length }
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Bulk post creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create posts'
    });
  }
});

// Bulk apply content template to multiple accounts
router.post('/apply-template', requireManager, [
  body('accountIds')
    .isArray({ min: 1 })
    .withMessage('Account IDs array is required'),
  body('templateId')
    .notEmpty()
    .withMessage('Template ID is required'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
], async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { accountIds, templateId, scheduledAt } = req.body;

    // Get template
    const template = await ContentTemplate.findOne({
      where: { 
        id: templateId,
        userId: req.user.id,
        isActive: true
      },
      transaction
    });

    if (!template) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const whereClause = { 
      id: { [Op.in]: accountIds },
      isActive: true
    };
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    // Get accounts
    const accounts = await InstagramAccount.findAll({
      where: whereClause,
      attributes: ['id', 'username'],
      transaction
    });

    if (accounts.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'No valid accounts found'
      });
    }

    // Create posts using template
    const posts = [];
    for (const account of accounts) {
      const post = await Post.create({
        caption: template.caption,
        hashtags: template.hashtags,
        mediaUrl: template.mediaUrl,
        accountId: account.id,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }, { transaction });

      posts.push({
        id: post.id,
        accountId: account.id,
        accountUsername: account.username
      });
    }

    await transaction.commit();

    logger.info(`Template applied to ${posts.length} accounts`, {
      userId: req.user.id,
      templateId,
      templateName: template.name,
      accountIds
    });

    res.json({
      success: true,
      message: `Successfully applied template "${template.name}" to ${posts.length} accounts`,
      data: { posts, createdCount: posts.length, template: template.name }
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Template application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply template'
    });
  }
});

// Bulk export accounts data
router.get('/export-accounts', async (req, res) => {
  try {
    const { format = 'json', includeStats = 'false' } = req.query;

    const whereClause = {};
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }

    const includeOptions = [];
    
    if (includeStats === 'true') {
      includeOptions.push({
        model: Post,
        as: 'posts',
        attributes: ['id', 'status', 'likesCount', 'commentsCount', 'createdAt']
      });
    }

    const accounts = await InstagramAccount.findAll({
      where: whereClause,
      include: includeOptions,
      order: [['createdAt', 'DESC']]
    });

    const exportData = accounts.map(account => {
      const data = {
        username: account.username,
        displayName: account.displayName,
        bio: account.bio,
        followersCount: account.followersCount,
        followingCount: account.followingCount,
        postsCount: account.postsCount,
        isVerified: account.isVerified,
        isPrivate: account.isPrivate,
        isActive: account.isActive,
        tags: account.tags,
        notes: account.notes,
        lastSyncAt: account.lastSyncAt,
        createdAt: account.createdAt
      };

      if (includeStats === 'true' && account.posts) {
        data.totalLikes = account.posts.reduce((sum, post) => sum + post.likesCount, 0);
        data.totalComments = account.posts.reduce((sum, post) => sum + post.commentsCount, 0);
        data.totalPosts = account.posts.length;
      }

      return data;
    });

    logger.info(`Accounts exported: ${accounts.length} accounts`, {
      userId: req.user.id,
      format,
      includeStats
    });

    if (format === 'csv') {
      // Convert to CSV format
      if (exportData.length === 0) {
        return res.json({
          success: true,
          message: 'No accounts to export',
          data: []
        });
      }

      const headers = Object.keys(exportData[0]);
      const csvRows = [headers.join(',')];
      
      exportData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) {
            return `"${value.join(';')}"`;
          }
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value || '';
        });
        csvRows.push(values.join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=accounts.csv');
      res.send(csvRows.join('\n'));
    } else {
      res.json({
        success: true,
        message: `Exported ${accounts.length} accounts`,
        data: exportData
      });
    }

  } catch (error) {
    logger.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export accounts'
    });
  }
});

module.exports = router;