const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Category Schema
const FieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ["text", "number", "date", "boolean"],
    default: "text",
  },
});

const SettingSchema = new mongoose.Schema({
  focus: String,
  tone: String,
  quantity: String,
  contentLenght: Number
});

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  alias: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ["blueprint", "project"],
    default: null,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  description: {
    type: String,
  },
  fields: [FieldSchema],
  level: { type: Number, required: true },
  settings: { type: SettingSchema }
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', CategorySchema);

async function importCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Read categories from JSON file
    const jsonPath = path.join(__dirname, 'categories.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ categories.json file not found. Please run fetchCategories.js first.');
      process.exit(1);
    }

    const categoriesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📊 Found ${categoriesData.length} categories in JSON file`);

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Import categories directly from JSON
    console.log('\n📥 Importing categories...');
    
    for (const categoryData of categoriesData) {
      try {
        // Handle date parsing properly
        let createdAt = new Date();
        let updatedAt = new Date();
        
        if (categoryData.createdAt) {
          const parsedCreatedAt = new Date(categoryData.createdAt);
          if (!isNaN(parsedCreatedAt.getTime())) {
            createdAt = parsedCreatedAt;
          }
        }
        
        if (categoryData.updatedAt) {
          const parsedUpdatedAt = new Date(categoryData.updatedAt);
          if (!isNaN(parsedUpdatedAt.getTime())) {
            updatedAt = parsedUpdatedAt;
          }
        }

        // Convert string _id back to ObjectId
        const category = new Category({
          _id: new mongoose.Types.ObjectId(categoryData._id),
          title: categoryData.title,
          alias: categoryData.alias,
          description: categoryData.description,
          fields: categoryData.fields || [],
          level: categoryData.level || 0,
          type: categoryData.type,
          parentId: categoryData.parentId ? new mongoose.Types.ObjectId(categoryData.parentId) : null,
          settings: categoryData.settings || {},
          createdAt: createdAt,
          updatedAt: updatedAt
        });

        await category.save();
        console.log(`   ✅ Imported: ${categoryData.title} (level: ${categoryData.level || 0})`);
        
      } catch (error) {
        console.error(`   ❌ Error importing ${categoryData.title}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully imported ${categoriesData.length} categories`);
    
    // Display summary
    const blueprintCategories = await Category.countDocuments({ type: 'blueprint' });
    const projectCategories = await Category.countDocuments({ type: 'project' });
    const rootCategories = await Category.countDocuments({ parentId: null });
    
    console.log('\n📊 Import Summary:');
    console.log(`- Total categories: ${categoriesData.length}`);
    console.log(`- Blueprint categories: ${blueprintCategories}`);
    console.log(`- Project categories: ${projectCategories}`);
    console.log(`- Root categories: ${rootCategories}`);
    
    // Show hierarchy summary
    const maxLevel = Math.max(...categoriesData.map(cat => cat.level || 0));
    for (let level = 0; level <= maxLevel; level++) {
      const count = await Category.countDocuments({ level });
      console.log(`- Level ${level} categories: ${count}`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error importing categories:', error);
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  importCategories();
}

module.exports = { importCategories }; 