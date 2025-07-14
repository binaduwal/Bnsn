# BNSN Backend Server

A Node.js TypeScript Express server with DeepSeek AI integration for the BNSN application.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Project Management**: CRUD operations for projects and blueprints  
- **AI Integration**: DeepSeek API for content generation and analysis
- **File Uploads**: Support for images and documents with express-fileupload
- **Email Campaigns**: Campaign management with AI-powered content generation
- **Rate Limiting**: Request rate limiting for API protection
- **Validation**: Request validation using Joi schemas
- **Error Handling**: Centralized error handling with detailed responses

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - List projects with filtering
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/:id/star` - Toggle project star
- `POST /api/projects/:id/duplicate` - Duplicate project

### Blueprints
- `GET /api/blueprints` - List blueprints
- `POST /api/blueprints` - Create new blueprint
- `GET /api/blueprints/:id` - Get blueprint by ID
- `PUT /api/blueprints/:id` - Update blueprint
- `DELETE /api/blueprints/:id` - Delete blueprint
- `POST /api/blueprints/:id/duplicate` - Duplicate blueprint
- `PUT /api/blueprints/:id/form-data` - Update blueprint form data

### AI Integration
- `POST /api/ai/generate-blueprint` - Generate blueprint with AI
- `POST /api/ai/generate-email-content` - Generate email content
- `POST /api/ai/clone-copy` - Clone existing copy with AI
- `POST /api/ai/suggest-improvements` - Get AI suggestions
- `POST /api/ai/analyze-project` - AI project analysis

### Campaigns
- `GET /api/campaigns` - List email campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/generate-content` - Generate AI content
- `GET /api/campaigns/:id/preview` - Preview campaign
- `GET /api/campaigns/:id/stats` - Campaign statistics
- `POST /api/campaigns/:id/send` - Send campaign

### File Upload
- `POST /api/upload/images` - Upload image files
- `POST /api/upload/documents` - Upload document files

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **MongoDB Setup**
   You need MongoDB running. Choose one option:
   
   **Option A: Local MongoDB**
   - Install MongoDB locally and start it
   - Default connection: `mongodb://localhost:27017/bnsn`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create cluster and get connection string
   - Replace localhost URL in `.env`

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database - Use one of these options:
   MONGODB_URI=mongodb://localhost:27017/bnsn
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bnsn
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # DeepSeek AI Configuration (optional)
   DEEPSEEK_API_KEY=your-deepseek-api-key-here
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   
   # Server Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Quick Start with Docker (MongoDB)

If you have Docker installed, you can quickly start MongoDB:

```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

Then start the server:
```bash
npm run dev
```

## Project Structure

```
server/
├── src/
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── errorHandler.ts # Error handling
│   │   ├── notFound.ts     # 404 handler
│   │   └── validation.ts   # Request validation
│   ├── routes/             # API route handlers
│   │   ├── auth.ts         # Authentication routes
│   │   ├── projects.ts     # Project management
│   │   ├── blueprints.ts   # Blueprint management
│   │   ├── campaigns.ts    # Email campaigns
│   │   ├── ai.ts          # AI integration
│   │   └── upload.ts      # File uploads
│   ├── services/          # Business logic
│   │   ├── deepseek.ts    # DeepSeek AI service
│   │   └── storage.ts     # File-based storage
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Shared types
│   ├── utils/             # Utility functions
│   │   └── index.ts       # Helper functions
│   └── index.ts           # Express app entry point
├── data/                  # JSON file storage
├── uploads/               # Uploaded files
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Storage System

Currently uses file-based JSON storage for simplicity. Data is stored in:
- `data/users/` - User accounts
- `data/projects/` - Project data  
- `data/blueprints/` - Blueprint data
- `data/campaigns/` - Email campaigns
- `uploads/` - Uploaded files

## DeepSeek Integration

The server integrates with DeepSeek AI for:
- **Blueprint Generation**: Create business blueprints from descriptions
- **Email Content**: Generate marketing email content
- **Copy Cloning**: Adapt existing copy to new contexts
- **Content Improvement**: Suggest content improvements
- **Project Analysis**: Analyze project data and provide insights

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers middleware
- **File Upload Limits**: Configurable file size and type restrictions

## Development

- **Hot Reload**: Uses `tsx watch` for development
- **TypeScript**: Full TypeScript support with strict mode
- **Error Handling**: Centralized error handling with detailed logging
- **Request Logging**: Morgan middleware for HTTP request logging

## Health Check

The server provides a health check endpoint:
```
GET /health
```

Returns server status and basic information.