import mongoose from 'mongoose';
import { Category } from '../models';
import dotenv from 'dotenv';

dotenv.config();

const migrateAlias = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all categories that don't have an alias field
    const categories = await Category.find({ alias: { $exists: false } });
    console.log(`Found ${categories.length} categories without alias field`);

    // Update each category to set alias to title
    for (const category of categories) {
      await Category.findByIdAndUpdate(category._id, {
        $set: { alias: category.title }
      });
      console.log(`Updated category: ${category.title} -> alias: ${category.title}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateAlias(); 