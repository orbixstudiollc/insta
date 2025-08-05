const express = require('express');
const { body, validationResult } = require('express-validator');
const { Post, InstagramAccount } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      accountId,
      status,
      postType,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    
    if (accountId) {
      whereClause.accountId = accountId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (postType) {
      whereClause.postType = postType;
    }

    // Include filter to ensure user can only see their posts
    const includeOptions = [{
      model: InstagramAccount,
      as: 'account',
      attributes: ['id', 'username', 'displayName'],
      where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
    }];

    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName'],
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    logger.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
});

// Create new post
router.post('/', [
  body('accountId')
    .notEmpty()
    .withMessage('Account ID is required'),
  body('caption')
    .optional()
    .isLength({ max: 2200 })
    .withMessage('Caption must not exceed 2200 characters'),
  body('postType')
    .optional()
    .isIn(['feed', 'story', 'reel'])
    .withMessage('Post type must be feed, story, or reel'),
  body('mediaType')
    .optional()
    .isIn(['image', 'video', 'carousel'])
    .withMessage('Media type must be image, video, or carousel'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
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

    // Verify account belongs to user
    const account = await InstagramAccount.findOne({
      where: {
        id: req.body.accountId,
        ...(req.user.role !== 'admin' && { userId: req.user.id })
      }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or access denied'
      });
    }

    const postData = {
      ...req.body,
      status: req.body.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null
    };

    const post = await Post.create(postData);

    logger.info(`New post created for account: ${account.username}`, {
      postId: post.id,
      accountId: account.id,
      userId: req.user.id
    });

    const createdPost = await Post.findByPk(post.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: createdPost
    });

  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// Update post
router.put('/:id', [
  body('caption')
    .optional()
    .isLength({ max: 2200 })
    .withMessage('Caption must not exceed 2200 characters'),
  body('postType')
    .optional()
    .isIn(['feed', 'story', 'reel'])
    .withMessage('Post type must be feed, story, or reel'),
  body('mediaType')
    .optional()
    .isIn(['image', 'video', 'carousel'])
    .withMessage('Media type must be image, video, or carousel'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
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

    // Find post and verify ownership
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or access denied'
      });
    }

    // Don't allow updating published posts
    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update published posts'
      });
    }

    const updates = { ...req.body };
    
    // Update status based on scheduledAt
    if (req.body.scheduledAt) {
      updates.status = 'scheduled';
      updates.scheduledAt = new Date(req.body.scheduledAt);
    } else if (req.body.scheduledAt === null || req.body.scheduledAt === '') {
      updates.status = 'draft';
      updates.scheduledAt = null;
    }

    await post.update(updates);

    logger.info(`Post updated: ${post.id}`, {
      postId: post.id,
      accountId: post.accountId,
      userId: req.user.id
    });

    const updatedPost = await Post.findByPk(post.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName']
      }]
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    logger.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
    });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    // Find post and verify ownership
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or access denied'
      });
    }

    await post.destroy();

    logger.info(`Post deleted: ${post.id}`, {
      postId: post.id,
      accountId: post.accountId,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
});

// Get scheduled posts
router.get('/scheduled/upcoming', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + parseInt(days));

    const posts = await Post.findAll({
      where: {
        status: 'scheduled',
        scheduledAt: {
          [Op.between]: [now, futureDate]
        }
      },
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName'],
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }],
      order: [['scheduledAt', 'ASC']]
    });

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {
    logger.error('Error fetching scheduled posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled posts'
    });
  }
});

// Publish post immediately
router.post('/:id/publish', async (req, res) => {
  try {
    // Find post and verify ownership
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or access denied'
      });
    }

    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Post is already published'
      });
    }

    // TODO: Implement actual Instagram API publishing
    // For now, just update the status
    await post.update({
      status: 'published',
      publishedAt: new Date(),
      scheduledAt: null
    });

    logger.info(`Post published: ${post.id}`, {
      postId: post.id,
      accountId: post.accountId,
      userId: req.user.id
    });

    const publishedPost = await Post.findByPk(post.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName']
      }]
    });

    res.json({
      success: true,
      message: 'Post published successfully',
      data: publishedPost
    });

  } catch (error) {
    logger.error('Error publishing post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish post'
    });
  }
});

// Duplicate post
router.post('/:id/duplicate', async (req, res) => {
  try {
    // Find original post and verify ownership
    const originalPost = await Post.findByPk(req.params.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
      }]
    });

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or access denied'
      });
    }

    // Create duplicate with draft status
    const duplicateData = {
      caption: originalPost.caption,
      mediaUrl: originalPost.mediaUrl,
      mediaType: originalPost.mediaType,
      postType: originalPost.postType,
      hashtags: originalPost.hashtags,
      location: originalPost.location,
      accountId: originalPost.accountId,
      status: 'draft',
      scheduledAt: null
    };

    const duplicatePost = await Post.create(duplicateData);

    logger.info(`Post duplicated: ${originalPost.id} -> ${duplicatePost.id}`, {
      originalPostId: originalPost.id,
      duplicatePostId: duplicatePost.id,
      accountId: originalPost.accountId,
      userId: req.user.id
    });

    const createdPost = await Post.findByPk(duplicatePost.id, {
      include: [{
        model: InstagramAccount,
        as: 'account',
        attributes: ['id', 'username', 'displayName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Post duplicated successfully',
      data: createdPost
    });

  } catch (error) {
    logger.error('Error duplicating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate post'
    });
  }
});

module.exports = router;