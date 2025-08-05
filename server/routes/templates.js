const express = require('express');
const { body, validationResult } = require('express-validator');
const { ContentTemplate } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authenticateToken);

// Get all templates
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = { userId: req.user.id };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { caption: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: templates } = await ContentTemplate.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
});

// Create template
router.post('/', [
  body('name').notEmpty().withMessage('Template name is required'),
  body('caption').optional().isLength({ max: 2200 }),
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

    const template = await ContentTemplate.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });

  } catch (error) {
    logger.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template'
    });
  }
});

module.exports = router;