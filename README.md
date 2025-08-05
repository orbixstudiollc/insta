# Instagram Account Manager

A comprehensive web application for managing 100+ Instagram accounts efficiently. Built with Node.js, Express, React, and SQLite.

## 🚀 Features

### Core Functionality
- **Account Management**: Add, edit, delete, and organize Instagram accounts
- **Bulk Operations**: Import/export accounts, bulk updates, mass post creation
- **Post Scheduling**: Create and schedule posts across multiple accounts
- **Content Templates**: Reusable content for consistent posting
- **Analytics Dashboard**: Track performance metrics and engagement
- **User Management**: Role-based access control (Admin, Manager, User)

### Technical Features
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Rate Limiting**: Comprehensive rate limiting to respect API limits
- **Database Management**: SQLite with Sequelize ORM
- **Modern UI**: Material-UI React components with responsive design
- **RESTful API**: Well-structured API endpoints
- **Comprehensive Logging**: Winston logger with rotating files
- **Input Validation**: Server-side validation with express-validator

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd instagram-account-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install all dependencies (server + client)
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/.env.example server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Database Setup**
   ```bash
   # The database will be automatically created on first run
   # SQLite database file will be created in the server directory
   ```

## ⚙️ Configuration

### Environment Variables

Edit `server/.env` with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (SQLite file path)
DATABASE_URL=./database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Instagram API (if using official APIs)
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/callback

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=info
```

## 🚀 Running the Application

### Development Mode
```bash
# Start both server and client in development mode
npm run dev

# Or start individually:
npm run server:dev  # Start server only
npm run client:dev  # Start client only
```

### Production Mode
```bash
# Build the client
npm run build

# Start the production server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register       # Register new user
POST /api/auth/login          # User login
GET  /api/auth/profile        # Get user profile
PUT  /api/auth/profile        # Update user profile
PUT  /api/auth/change-password # Change password
GET  /api/auth/verify-token   # Verify JWT token
```

### Account Management
```
GET    /api/accounts          # Get all accounts (with pagination)
GET    /api/accounts/:id      # Get single account
POST   /api/accounts          # Create new account
PUT    /api/accounts/:id      # Update account
DELETE /api/accounts/:id      # Delete account
POST   /api/accounts/:id/sync # Sync account data
PATCH  /api/accounts/bulk-update # Bulk update accounts
```

### Post Management
```
GET    /api/posts             # Get all posts
GET    /api/posts/:id         # Get single post
POST   /api/posts             # Create new post
PUT    /api/posts/:id         # Update post
DELETE /api/posts/:id         # Delete post
POST   /api/posts/:id/publish # Publish post immediately
POST   /api/posts/:id/duplicate # Duplicate post
GET    /api/posts/scheduled/upcoming # Get scheduled posts
```

### Bulk Operations
```
POST   /api/bulk/import-accounts    # Import accounts from JSON/CSV
PATCH  /api/bulk/update-accounts    # Bulk update multiple accounts
DELETE /api/bulk/delete-accounts    # Bulk delete accounts
POST   /api/bulk/create-posts       # Create posts for multiple accounts
POST   /api/bulk/apply-template     # Apply template to multiple accounts
GET    /api/bulk/export-accounts    # Export accounts data
```

### Analytics
```
GET /api/analytics/dashboard           # Get dashboard overview
GET /api/analytics/account/:accountId  # Get account analytics
```

### Templates
```
GET    /api/templates         # Get all templates
GET    /api/templates/:id     # Get single template
POST   /api/templates         # Create new template
PUT    /api/templates/:id     # Update template
DELETE /api/templates/:id     # Delete template
```

## 🏗 Project Structure

```
instagram-account-manager/
├── package.json              # Root package.json
├── README.md                 # This file
├── server/                   # Backend server
│   ├── package.json         # Server dependencies
│   ├── index.js             # Server entry point
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── logs/                # Log files
│   └── uploads/             # File uploads
├── client/                   # React frontend
│   ├── package.json         # Client dependencies
│   ├── public/              # Static files
│   └── src/                 # React source code
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── contexts/        # React contexts
│       ├── services/        # API services
│       └── App.js           # Main App component
```

## 👥 User Roles

1. **Admin**: Full access to all features and user management
2. **Manager**: Can manage accounts and perform bulk operations
3. **User**: Basic access to own accounts and posts

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Server-side validation on all endpoints
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet**: Security headers middleware

## 📊 Database Schema

### Users
- id, username, email, password, role, isActive, createdAt, updatedAt

### Instagram Accounts
- id, username, displayName, bio, profilePicture, isPrivate, isVerified
- followersCount, followingCount, postsCount, isActive, lastSyncAt
- notes, tags, userId, createdAt, updatedAt

### Posts
- id, caption, mediaUrl, mediaType, postType, status, scheduledAt, publishedAt
- likesCount, commentsCount, hashtags, location, accountId, createdAt, updatedAt

### Analytics
- id, date, followersCount, followingCount, postsCount, totalLikes, totalComments
- engagementRate, reach, impressions, accountId, createdAt, updatedAt

### Content Templates
- id, name, caption, hashtags, mediaUrl, category, isActive, userId, createdAt, updatedAt

## 🚦 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Bulk Operations**: 10 operations per hour
- **Instagram API**: 200 requests per hour per user

## 📝 Logging

Logs are stored in `server/logs/`:
- `combined.log`: All log levels
- `error.log`: Error level only
- Console output in development mode

## 🧪 Testing

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Update JWT_SECRET with a strong secret
3. Configure proper CORS origins
4. Set up proper logging levels

### Database
- SQLite is used by default (suitable for development)
- For production, consider migrating to PostgreSQL or MySQL

### Example Production Start
```bash
NODE_ENV=production PORT=80 npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notes

### Instagram API Compliance
- This application is designed to work with Instagram's official APIs
- Ensure compliance with Instagram's Terms of Service
- Rate limiting is implemented to respect API limits
- Always obtain proper permissions before managing accounts

### Security Considerations
- Change default JWT secret in production
- Use HTTPS in production
- Regularly update dependencies
- Monitor logs for suspicious activity
- Implement proper backup strategies

### Performance Tips
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Monitor database performance
- Consider CDN for media files

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if the server directory is writable
   - Ensure SQLite3 is properly installed

2. **Frontend Can't Connect to Backend**
   - Verify the proxy setting in client/package.json
   - Check if backend is running on port 5000

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token expiration settings

4. **Rate Limiting Too Restrictive**
   - Adjust rate limit settings in .env
   - Check IP address in logs

### Getting Help
- Check the logs in `server/logs/`
- Use the health check endpoint: `/api/health`
- Enable debug logging: `LOG_LEVEL=debug`

## 🔄 Updates and Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor log files for errors
- Backup database files
- Review and rotate JWT secrets
- Update rate limiting rules as needed

---

**Happy Instagram Managing! 📸✨**
