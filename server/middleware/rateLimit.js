const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../utils/logger');

// Rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Number of requests
    duration: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60, // Per 15 minutes
  }),
  
  // Stricter rate limiting for authentication endpoints
  auth: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 5, // 5 attempts
    duration: 15 * 60, // Per 15 minutes
    blockDuration: 15 * 60, // Block for 15 minutes
  }),
  
  // Rate limiting for bulk operations
  bulk: new RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 10, // 10 bulk operations
    duration: 60 * 60, // Per hour
    blockDuration: 30 * 60, // Block for 30 minutes
  }),
  
  // Rate limiting for Instagram API calls (to respect Instagram's limits)
  instagram: new RateLimiterMemory({
    keyGenerator: (req) => req.user?.id || req.ip,
    points: 200, // 200 requests per user
    duration: 60 * 60, // Per hour
    blockDuration: 60 * 60, // Block for 1 hour
  }),
};

// Rate limiter middleware factory
function createRateLimitMiddleware(limiterType = 'general') {
  return async (req, res, next) => {
    try {
      const limiter = rateLimiters[limiterType];
      if (!limiter) {
        return next();
      }
      
      await limiter.consume(req.ip);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, endpoint: ${req.path}`, {
        ip: req.ip,
        endpoint: req.path,
        retryAfter: secs,
        limiterType
      });
      
      res.set('Retry-After', String(secs));
      res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: secs
      });
    }
  };
}

// Setup rate limiting for the Express app
function setupRateLimit(app) {
  // General rate limiting for all API routes
  app.use('/api', createRateLimitMiddleware('general'));
  
  // Specific rate limiting for auth routes
  app.use('/api/auth', createRateLimitMiddleware('auth'));
  
  // Specific rate limiting for bulk operations
  app.use('/api/bulk', createRateLimitMiddleware('bulk'));
  
  logger.info('Rate limiting middleware configured');
}

module.exports = {
  setupRateLimit,
  createRateLimitMiddleware,
  rateLimiters
};