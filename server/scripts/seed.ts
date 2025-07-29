import bcrypt from 'bcryptjs';
import { connectDatabase } from '../src/config/database';
import { User } from '../src/models';

const seedUsers = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    // Clear existing users (optional - remove if you want to keep existing data)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');
    
    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create admin user
    const admin = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      totalWords: 1000000,
      wordsUsed: 0,
      wordsLeft: 1000000,
    });
    
    // Create regular user
    const user = new User({
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      totalWords: 100000,
      wordsUsed: 0,
      wordsLeft: 100000,
    });
    
    // Save users
    await admin.save();
    await user.save();
    
    console.log('✅ Successfully seeded users:');
    console.log('   - Admin: admin@example.com (password: password123)');
    console.log('   - User: user@example.com (password: password123)');
    
    // Use process from Node.js, add type for error
    // eslint-disable-next-line no-undef
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

seedUsers();