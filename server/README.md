# BNSN Server

Backend server for AI District Copywrite application with DeepSeek integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Yarn or npm

### Installation

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server root directory with the following variables:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5002
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/bnsn
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100000
   
   # File Upload
   UPLOAD_PATH=./uploads
   
   # DeepSeek AI Integration
   DEEPSEEK_API_KEY=your-deepseek-api-key
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   
   # Stripe Payment Integration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   
   # Client URL (for payment redirects)
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system. If using Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🗄️ Database Setup

### 1. Seed Users

Run the user seeding script to create default admin and user accounts:

```bash
# Using yarn
yarn seed

# Using npm
npm run seed
```

This will create:
- **Admin User:** `admin@example.com` / `password123`
- **Regular User:** `user@example.com` / `password123`

### 2. Import Categories

Import the pre-configured categories for the system:

```bash
# Using yarn
yarn categories:import

# Using npm
npm run categories:import
```

This imports all categories from `scripts/categories.json` including:
- Blueprint categories
- Project categories
- Hierarchical structure with proper parent-child relationships

### 3. Reset Categories (if needed)

To reset and re-import categories:

```bash
# Using yarn
yarn categories:reset

# Using npm
npm run categories:reset
```

## 🏃‍♂️ Running the Server

### Development Mode

```bash
# Using yarn
yarn dev

# Using npm
npm run dev
```

The server will start on `http://localhost:5002` with hot reload enabled.

### Production Mode

```bash
# Build the project
yarn build
# or
npm run build

# Start production server
yarn start
# or
npm start
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── scripts/             # Database scripts
│   ├── seed.ts          # User seeding
│   ├── importCategories.js  # Category import
│   ├── exportCategories.js  # Category export
│   └── categories.json  # Category data
├── uploads/             # File upload directory
└── dist/                # Compiled JavaScript (production)
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build TypeScript to JavaScript |
| `yarn start` | Start production server |
| `yarn seed` | Seed database with default users |
| `yarn categories:import` | Import categories from JSON |
| `yarn categories:export` | Export categories to JSON |
| `yarn categories:reset` | Reset and re-import categories |
| `yarn migrate:word-count` | Migrate word count data |
| `yarn migrate:alias` | Migrate alias data |
| `yarn test:payment` | Test payment integration |

## 🔐 Authentication

The server uses JWT-based authentication. Users can:

1. **Register:** `POST /api/auth/register`
2. **Login:** `POST /api/auth/login`
3. **Protected routes** require the `Authorization: Bearer <token>` header

## 💳 Payment Integration

Stripe integration is configured for handling payments. Make sure to:

1. Set up your Stripe account
2. Configure webhook endpoints
3. Set the `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` environment variables

## 🤖 AI Integration

DeepSeek AI integration is configured for content generation. Set up:

1. DeepSeek API account
2. Configure `DEEPSEEK_API_KEY` environment variable
3. The service is available at `/api/ai/*` endpoints

## 📊 Database Models

### Users
- Email, password, name
- Role-based access (admin/user)
- Word count tracking
- Custom category aliases

### Categories
- Hierarchical structure (blueprint/project types)
- Custom fields and settings
- Alias support for user customization

### Projects
- Content generation templates
- User-specific data
- Status tracking

### Activities
- User action logging
- Audit trail

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - Verify network connectivity

2. **JWT Errors:**
   - Ensure `JWT_SECRET` is set
   - Check token expiration settings

3. **File Upload Issues:**
   - Ensure `uploads/` directory exists
   - Check file permissions
   - Verify `UPLOAD_PATH` environment variable

4. **Category Import Errors:**
   - Ensure `categories.json` exists in `scripts/`
   - Check MongoDB connection
   - Verify category data format

### Logs

The server uses Morgan for HTTP logging. In development, you'll see detailed request logs. In production, logs are more concise.

## 🔄 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `5002` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100000` | No |
| `UPLOAD_PATH` | File upload directory | `./uploads` | No |
| `DEEPSEEK_API_KEY` | DeepSeek API key | - | Yes |
| `DEEPSEEK_BASE_URL` | DeepSeek API base URL | `https://api.deepseek.com` | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - | Yes |
| `CLIENT_URL` | Frontend URL for redirects | `http://localhost:3000` | No |

## 📝 License

ISC License 