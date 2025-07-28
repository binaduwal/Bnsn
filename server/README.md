# BNSN Server

Backend server for BNSN application with DeepSeek integration.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create a `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/bnsn
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
DEEPSEEK_API_KEY=your_deepseek_api_key
```

3. Run the word count migration (for existing users):
```bash
yarn migrate:word-count
```

4. Start the development server:
```bash
yarn dev
```

## Word Count System

The application now includes a word count tracking system that:

- Tracks total words allocated to each user (default: 100,000)
- Counts words used in generated content
- Updates word count in real-time when content is generated
- Excludes HTML tags and metadata from word counting
- Provides API endpoints to fetch current word count

### API Endpoints

- `GET /auth/word-count` - Get current user's word count statistics
- Word count is automatically updated when content is generated via `/projects/generate`

### Migration

If you have existing users, run the migration to add word count fields:

```bash
yarn migrate:word-count
```

This will set default values for existing users:
- `totalWords`: 100,000
- `wordsUsed`: 0
- `wordsLeft`: 100,000