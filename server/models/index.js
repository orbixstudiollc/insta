const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// User model for authentication
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Instagram Account model
const InstagramAccount = sequelize.define('InstagramAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  followersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

// Post model for managing posts
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video', 'carousel'),
    defaultValue: 'image',
  },
  postType: {
    type: DataTypes.ENUM('feed', 'story', 'reel'),
    defaultValue: 'feed',
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'published', 'failed'),
    defaultValue: 'draft',
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  hashtags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Analytics model for tracking performance
const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  followersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalLikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalComments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  engagementRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Content Template model for bulk operations
const ContentTemplate = sequelize.define('ContentTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hashtags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Define associations
User.hasMany(InstagramAccount, { foreignKey: 'userId', as: 'accounts' });
InstagramAccount.belongsTo(User, { foreignKey: 'userId', as: 'user' });

InstagramAccount.hasMany(Post, { foreignKey: 'accountId', as: 'posts' });
Post.belongsTo(InstagramAccount, { foreignKey: 'accountId', as: 'account' });

InstagramAccount.hasMany(Analytics, { foreignKey: 'accountId', as: 'analytics' });
Analytics.belongsTo(InstagramAccount, { foreignKey: 'accountId', as: 'account' });

User.hasMany(ContentTemplate, { foreignKey: 'userId', as: 'templates' });
ContentTemplate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  InstagramAccount,
  Post,
  Analytics,
  ContentTemplate,
};