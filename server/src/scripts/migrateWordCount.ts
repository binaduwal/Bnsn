import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models';

dotenv.config();

async function migrateWordCount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bnsn');
    console.log('Connected to MongoDB');

    // Find all users that don't have word count fields
    const usersToUpdate = await User.find({
      $or: [
        { totalWords: { $exists: false } },
        { wordsUsed: { $exists: false } },
        { wordsLeft: { $exists: false } }
      ]
    });

    console.log(`Found ${usersToUpdate.length} users to update`);

    // Update each user with default word count values
    for (const user of usersToUpdate) {
      user.totalWords = 100000;
      user.wordsUsed = 0;
      user.wordsLeft = 100000;
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateWordCount(); 